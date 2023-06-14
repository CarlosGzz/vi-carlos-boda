import { Component, Input, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css'],
})
export class RsvpComponent {
  @Input() invitado: any;
  @Input() invitadosData: any;

  rsvpForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.maxLength(15)]],
    tieneAlergia: [false],
    alergias: [''],
    confirmarAsistencia: [false],
    invitadosExtra: this.fb.array([]),
  });

  invitados = [
    { name: 'invitado 1', invitadosDeInvitado: ['plus 1', 'plus 2'] },
    { name: 'invitado 2', invitadosDeInvitado: ['plus 1', 'plus 2'] },
  ];
  get hasInvitado() {
    return !!this.invitado;
  }

  get hasPlusOne() {
    if (this.invitado) {
      return this.invitado.invitadoExtra > 0;
    }
    return false;
  }

  get invitadosExtraArray(): FormArray {
    return this.rsvpForm.get('invitadosExtra') as FormArray;
  }

  get tieneAlergia(): FormControl {
    return this.rsvpForm.get('tieneAlergia') as FormControl;
  }

  get asistira(): FormControl {
    return this.rsvpForm.get('confirmarAsistencia') as FormControl;
  }

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['invitado'].currentValue !== null &&
      changes['invitado'].currentValue !== changes['invitado'].previousValue
    ) {
      if (this.hasInvitado) {
        this.rsvpForm.patchValue({
          name: this.invitado.nombre,
          phone: this.invitado.telefono,
        });
        if (this.invitado.invitadoExtra > 0) {
          for (let index = 0; index < this.invitado.invitadoExtra; index++) {
            if (this.invitado.invitadosExtraLista) {
              this.addInvitadoExtra(
                this.invitadosExtraArray,
                this.invitado.invitadosExtraLista[index]
              );
            } else {
              this.addInvitadoExtra(this.invitadosExtraArray, null);
            }
          }
          // this.invitado.invitadosExtraLista.forEach((invitado: any) => {
          //   this.addInvitadoExtra(this.invitadosExtraArray, invitado);
          // });
        }
      }
    }
  }
  invitadoSeleccionado(event: any) {
    console.log(event);
    this.router.navigate(['/inicio', event.value]);
  }

  invitadoExtra(invitadoExtraData: any): FormGroup {
    if (invitadoExtraData) {
      return this.fb.group({
        nombre: invitadoExtraData.nombre,
        tieneAlergia: [false],
        alergias: [''],
        confirmarAsistencia: [false],
      });
    }
    return this.fb.group({
      nombre: '',
      tieneAlergia: [false],
      alergias: [''],
      confirmarAsistencia: [false],
    });
  }

  addInvitadoExtra(formArray: any, invitadoExtraData: any) {
    formArray.push(this.invitadoExtra(invitadoExtraData));
  }
  tieneAlergiaInvitadoExtra(form: any): boolean {
    console.log(form);
    if (form !== null) {
      let tieneAlergia = form.get('tieneAlergia');
      return tieneAlergia ? tieneAlergia.value : false;
    }
    return false;
  }

  onSubmit() {
    console.log(this.rsvpForm.value);
  }
}
