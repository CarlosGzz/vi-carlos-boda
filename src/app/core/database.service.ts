import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

export interface Invitado {
  id?: number;
  nombre: string;
  telefono: string;
  alergias: string;
  numeroDeInvitadosExtra?: number;
  confirmacionAsistencia: boolean;
  invitadosExtraLista?: Array<Invitado>;
  estatusDeInvitacion?: string;
  invitadoCivil?: string;
  quienInvito?: string;
  url?: string;
  adultoOJoven?: string;
  quienInvita?: string;
  posibleNoAsistencia?: boolean;
  nombreEnInvitacion?: string;
  sexo?: string;
}
export interface InvitadoExtra {
  nombre?: string;
  alergias?: string;
  confirmacionAsistencia?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private dbPath = '/invitados';
  invitadosRef: AngularFireList<Invitado>;
  invitados!: Array<Invitado>;
  invitado!: Invitado;

  constructor(private db: AngularFireDatabase) {
    this.invitadosRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Invitado> {
    return this.invitadosRef;
  }

  getInvitado(userId: number) {
    this.db
      .object(this.dbPath + '/' + userId)
      .valueChanges()
      .subscribe((user: any) => {
        this.invitado = user;
        if (this.invitado?.estatusDeInvitacion === 'no visto') {
          this.update('' + userId, {
            estatusDeInvitacion: 'visto',
          });
        }
      });
  }

  retrieveInvitados(): void {
    this.getAll()
      .snapshotChanges()
      .pipe(
        map((changes: any[]) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        this.invitados = data;
      });
  }

  // create(tutorial: Invitado): any {
  //   return this.invitadosRef.push(tutorial);
  // }

  update(key: string, value: any): Promise<void> {
    return this.invitadosRef.update(key, value);
  }

  // delete(key: string): Promise<void> {
  //   return this.invitadosRef.remove(key);
  // }

  // deleteAll(): Promise<void> {
  //   return this.invitadosRef.remove();
  // }
}
