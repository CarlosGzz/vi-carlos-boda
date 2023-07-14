import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Invitado } from '../core/database.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css'],
})
export class RsvpComponent {
  @Input()
  invitado!: Invitado | null;
  @Input() invitadosData: any;
  @Output() updatedInvitado = new EventEmitter<Invitado>();

  showForm = true;

  rsvpForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    telefono: ['', [Validators.required, Validators.maxLength(15)]],
    tieneAlergia: [false],
    alergias: [''],
    confirmarAsistencia: [false, Validators.required],
    invitadosExtra: this.fb.array([]),
  });

  get hasInvitado() {
    return !!this.invitado;
  }

  get hasPlusOne() {
    if (this.invitado) {
      return this.invitado.numeroDeInvitadosExtra > 0;
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

  get invitadoConfirmado(): boolean {
    if (this.hasInvitado && this.invitado) {
      return this.invitado.estatusDeInvitacion === 'confirmado';
    }
    return !this.showForm;
  }

  get invitadoConfirmacionPositiva(): boolean {
    if (this.invitado) return this.invitado.confirmacionAsistencia;
    return false;
  }

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.rsvpForm.get('tieneAlergia')!.valueChanges.subscribe((data) => {
      this.rsvpForm.patchValue({ alergias: '' });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['invitado'] &&
      changes['invitado'].currentValue !== null &&
      changes['invitado'].currentValue !== changes['invitado'].previousValue
    ) {
      if (this.hasInvitado && this.invitado) {
        this.showForm = this.invitado.estatusDeInvitacion !== 'confirmado';
        const tieneAlergia = this.invitado.alergias !== '';
        this.rsvpForm.patchValue({
          nombre: this.invitado.nombre,
          telefono: this.invitado.telefono,
          tieneAlergia: tieneAlergia,
          alergias: this.invitado.alergias,
          confirmarAsistencia: this.invitado.confirmacionAsistencia,
        });
        if (this.invitado.numeroDeInvitadosExtra > 0) {
          for (
            let index = 0;
            index < this.invitado.numeroDeInvitadosExtra;
            index++
          ) {
            if (this.invitado.invitadosExtraLista) {
              this.addInvitadoExtra(
                this.invitadosExtraArray,
                this.invitado.invitadosExtraLista[index]
              );
            } else {
              this.addInvitadoExtra(this.invitadosExtraArray, null);
            }
          }
        }
      }
    }
  }

  invitadoSeleccionado(event: any) {
    this.router.navigate(['/inicio', event.value]);
  }

  invitadoExtraFormGroup(invitadoExtraData: any): FormGroup {
    if (invitadoExtraData) {
      const tieneAlergia = invitadoExtraData.alergias !== '';
      return this.fb.group({
        nombre: [invitadoExtraData.nombre],
        tieneAlergia: [tieneAlergia],
        alergias: [invitadoExtraData.alergias],
        confirmarAsistencia: [invitadoExtraData.confirmacionAsistencia],
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
    if(formArray.length <= this.invitado.numeroDeInvitadosExtra) {
      formArray.push(this.invitadoExtraFormGroup(invitadoExtraData));
    }
  }

  tieneAlergiaInvitadoExtra(form: any): boolean {
    if (form !== null) {
      let tieneAlergia = form.get('tieneAlergia');
      return tieneAlergia ? tieneAlergia.value : false;
    }
    return false;
  }

  invExtraAlergiaChange(event: any, index: any) {
    if (!event.value) {
      this.invitadosExtraArray.controls[index].patchValue({ alergias: '  ' });
    }
  }

  reabrirFormulario() {
    this.showForm = true;
  }

  onSubmit() {
    let updatedInvitado: any = {
      nombre: this.rsvpForm.value.nombre,
      telefono: this.rsvpForm.value.telefono,
      alergias: this.rsvpForm.value.alergias,
      confirmacionAsistencia: this.rsvpForm.value.confirmarAsistencia,
      estatusDeInvitacion: 'confirmado',
    };
    if (this.invitado) {
      if (this.invitado.numeroDeInvitadosExtra > 0) {
        updatedInvitado['invitadosExtraLista'] =
          this.invitado.invitadosExtraLista;
        for (
          let index = 0;
          index < this.invitado.numeroDeInvitadosExtra;
          index++
        ) {
          if (updatedInvitado.invitadosExtraLista[index]) {
            let invExtraForm = this.invitadosExtraArray.value[index];
            updatedInvitado.invitadosExtraLista[index] = {
              ...updatedInvitado.invitadosExtraLista[index],
              nombre: invExtraForm.nombre,
              alergias: invExtraForm.alergias,
              confirmacionAsistencia: invExtraForm.confirmarAsistencia,
            };
          }
        }
      }
      this.updatedInvitado.emit(updatedInvitado);
      this.showForm = false;
    }
  }
}
