import { Component } from '@angular/core';
import { DatabaseService, Invitado } from '../core/database.service';
import { map } from 'rxjs/operators';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ExcelServiceService } from '../core/excel-service.service';

@Component({
  selector: 'app-lista-invitados',
  templateUrl: './lista-invitados.component.html',
  styleUrls: ['./lista-invitados.component.css'],
  standalone: true,
  imports: [MatChipsModule, MatTableModule, MatButtonModule, CommonModule],
})
export class ListaInvitadosComponent {
  displayedColumns: string[] = [
    'key',
    'nombre',
    'confirmacionAsistencia',
    'alergias',
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  invitadosList!: Array<Invitado>;

  constructor(
    private invitadosService: DatabaseService,
    private excelService: ExcelServiceService
  ) {
    this.retrieveInvitados();
  }

  retrieveInvitados(): void {
    this.invitadosService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes: any[]) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        this.invitadosList = data;
      });
  }

  addColumn() {
    const randomColumn = Math.floor(
      Math.random() * this.displayedColumns.length
    );
    this.columnsToDisplay.push(this.displayedColumns[randomColumn]);
  }

  removeColumn() {
    if (this.columnsToDisplay.length) {
      this.columnsToDisplay.pop();
    }
  }

  shuffle() {
    let currentIndex = this.columnsToDisplay.length;
    while (0 !== currentIndex) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap
      let temp = this.columnsToDisplay[currentIndex];
      this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
      this.columnsToDisplay[randomIndex] = temp;
    }
  }

  exportExcel(): void {
    let excelJson: any[] = [];
    this.invitadosList.forEach((invitado) => {
      excelJson.push({
        nombre: invitado.nombre,
        telefono: invitado.telefono,
        confirmacionAsistencia: invitado.confirmacionAsistencia ? 'Si' : 'No',
        alergias: invitado.alergias,
      });
      if (invitado.numeroDeInvitadosExtra > 0) {
        invitado.invitadosExtraLista?.forEach((invExtra) => {
          excelJson.push({
            nombre: invExtra.nombre,
            telefono: '',
            confirmacionAsistencia: invExtra.confirmacionAsistencia
              ? 'Si'
              : 'No',
            alergias: invExtra.alergias,
          });
        });
      }
    });

    this.excelService.exportAsExcelFile(
      excelJson,
      'Invitados-' + new Date().getTime() + '.xlsx'
    );
  }

  hideExtraRow(row: any) {
    console.log(row);
    console.log(
      row.numeroDeInvitadosExtra !== 0 &&
        'invitadosExtraLista' in row &&
        row.invitadosExtraLista.length > 0
    );
    return (
      row.numeroDeInvitadosExtra !== 0 &&
      'invitadosExtraLista' in row &&
      row.invitadosExtraLista.length > 0
    );
  }
}
