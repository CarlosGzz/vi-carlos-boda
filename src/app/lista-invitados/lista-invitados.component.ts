import { Component, ViewChild } from '@angular/core';
import { DatabaseService, Invitado } from '../core/database.service';
import { map } from 'rxjs/operators';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ExcelServiceService } from '../core/excel-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ColumnMode,
  DatatableComponent,
  NgxDatatableModule,
  SortType,
} from '@swimlane/ngx-datatable';
import { HttpClient } from '@angular/common/http';

let filters = {
  novistos: (inv) => {
    return inv.estatusDeInvitacion === 'no visto';
  },
  vistos: (inv) => {
    return inv.estatusDeInvitacion === 'visto';
  },
  confirmados: (inv) => {
    return inv.estatusDeInvitacion === 'confirmado';
  },
  asistiran: (inv) => {
    return (
      inv.confirmacionAsistencia === true &&
      inv.estatusDeInvitacion === 'confirmado'
    );
  },
  noAsistiran: (inv) => {
    return (
      inv.confirmacionAsistencia === false &&
      inv.estatusDeInvitacion === 'confirmado'
    );
  },
  'Carlos & Vi': (inv) => {
    return inv.quienInvito === 'Carlos & Vi';
  },
  'Carlos & Vi Pendientes': (inv) => {
    return (
      inv.quienInvito === 'Carlos & Vi' &&
      inv.estatusDeInvitacion !== 'confirmado'
    );
  },
  'Carlos & Vi Confirmados': (inv) => {
    return (
      inv.quienInvito === 'Carlos & Vi' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      inv.confirmacionAsistencia
    );
  },
  'Carlos & Vi No Asistentes': (inv) => {
    return (
      inv.quienInvito === 'Carlos & Vi' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      !inv.confirmacionAsistencia
    );
  },
  Violeta: (inv) => {
    return inv.quienInvito === 'Violeta';
  },
  'Violeta Pendientes': (inv) => {
    return (
      inv.quienInvito === 'Violeta' && inv.estatusDeInvitacion !== 'confirmado'
    );
  },
  'Violeta Confirmados': (inv) => {
    return (
      inv.quienInvito === 'Violeta' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      inv.confirmacionAsistencia
    );
  },
  'Violeta No Asistentes': (inv) => {
    return (
      inv.quienInvito === 'Violeta' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      !inv.confirmacionAsistencia
    );
  },
  Carlos: (inv) => {
    return inv.quienInvito === 'Carlos';
  },
  'Carlos Pendientes': (inv) => {
    return (
      inv.quienInvito === 'Carlos' && inv.estatusDeInvitacion !== 'confirmado'
    );
  },
  'Carlos Confirmados': (inv) => {
    return (
      inv.quienInvito === 'Carlos' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      inv.confirmacionAsistencia
    );
  },
  'Carlos No Asistentes': (inv) => {
    return (
      inv.quienInvito === 'Carlos' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      !inv.confirmacionAsistencia
    );
  },
  FV: (inv) => {
    return inv.quienInvito === 'FV';
  },
  'FV Pendientes': (inv) => {
    return inv.quienInvito === 'FV' && inv.estatusDeInvitacion !== 'confirmado';
  },
  'FV Confirmados': (inv) => {
    return (
      inv.quienInvito === 'FV' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      inv.confirmacionAsistencia
    );
  },
  'FV No Asistentes': (inv) => {
    return (
      inv.quienInvito === 'FV' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      !inv.confirmacionAsistencia
    );
  },
  FC: (inv) => {
    return inv.quienInvito === 'FC';
  },
  'FC Pendientes': (inv) => {
    return inv.quienInvito === 'FC' && inv.estatusDeInvitacion !== 'confirmado';
  },
  'FC Confirmados': (inv) => {
    return (
      inv.quienInvito === 'FC' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      inv.confirmacionAsistencia
    );
  },
  'FC No Asistentes': (inv) => {
    return (
      inv.quienInvito === 'FC' &&
      inv.estatusDeInvitacion === 'confirmado' &&
      !inv.confirmacionAsistencia
    );
  },
};

@Component({
  selector: 'app-lista-invitados',
  templateUrl: './lista-invitados.component.html',
  styleUrls: ['./lista-invitados.component.css'],
  standalone: true,
  imports: [
    MatChipsModule,
    MatTableModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
})
export class ListaInvitadosComponent {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  temp = [];
  invitadosList!: Array<Invitado>;
  excelForm: FormGroup;
  file: File;
  rows = [];
  columns = [
    // { prop: 'key' },
    { name: 'nombre' },
    { name: 'telefono' },
    { name: 'estatus de invitacion' },
    { name: 'confirmacion asistencia' },
    { name: 'alergias' },
    { name: 'invitado civil' },
    { name: 'quien invito' },
    { name: 'url' },
  ];
  columnsToDisplay: any[] = this.columns.slice();
  ColumnMode = ColumnMode;
  SortType = SortType;
  isFiltered = ['', false];
  hideDash = false;

  get getNoVistos() {
    if (this.temp) {
      let noVistos = this.temp.filter(
        (invitado) =>
          invitado.estatusDeInvitacion.toLocaleLowerCase() === 'no visto'
      );
      return noVistos.length;
    }
    return 0;
  }
  get getVistos() {
    if (this.temp) {
      let vistos = this.temp.filter(
        (invitado) =>
          invitado.estatusDeInvitacion.toLocaleLowerCase() === 'visto'
      );
      return vistos.length;
    }
    return 0;
  }
  get getConfirmados() {
    if (this.temp) {
      let noVistos = this.temp.filter(
        (invitado) =>
          invitado.estatusDeInvitacion.toLocaleLowerCase() === 'confirmado'
      );
      return noVistos.length;
    }
    return 0;
  }
  get getAsistentes() {
    if (this.temp) {
      let asistiran = this.temp.filter(
        (invitado) =>
          invitado.confirmacionAsistencia &&
          invitado.estatusDeInvitacion === 'confirmado'
      );
      return asistiran.length;
    }
    return 0;
  }
  get getNoAsistentes() {
    if (this.temp) {
      let noAsistiran = this.temp.filter(
        (invitado) =>
          !invitado.confirmacionAsistencia &&
          invitado.estatusDeInvitacion === 'confirmado'
      );
      return noAsistiran.length;
    }
    return 0;
  }

  constructor(
    private invitadosService: DatabaseService,
    private excelService: ExcelServiceService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.retrieveInvitados();
    this.excelForm = this.formBuilder.group({
      excelFile: [''],
    });
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
        this.temp = [...this.mapRows(data)];
        this.rows = this.mapRows(data);
      });
  }

  mapRows(dataRows) {
    let auxRows = [];
    dataRows.forEach((row) => {
      let hasInvitadoExtra = row.numeroDeInvitadosExtra > 0;
      row['treeStatus'] = hasInvitadoExtra ? 'collapsed' : 'disabled';
      auxRows.push(row);
      if (row.numeroDeInvitadosExtra > 0) {
        row.invitadosExtraLista.forEach((invExtraRow) => {
          invExtraRow['key'] = row.key;
          invExtraRow['treeStatus'] = 'disabled';
          invExtraRow['class'] = 'child-row-file';
          invExtraRow['estatusDeInvitacion'] = row.estatusDeInvitacion;
          invExtraRow['quienInvito'] = row.quienInvito;
          auxRows.push(invExtraRow);
        });
      }
    });
    return auxRows;
  }
  getRowClass(event) {
    if (event.class) {
      if (event.class == 'child-row-file')
        return {
          'child-row-file': true,
        };
    }
    return '';
  }

  getInvitadosByPerson(person) {
    let aux = this.temp.filter((inv) => inv.quienInvito === person);
    return aux.length;
  }

  getInvitadosPendientesByPerson(person) {
    let aux = this.temp.filter(
      (inv) =>
        inv.quienInvito === person && inv.estatusDeInvitacion !== 'confirmado'
    );
    return aux.length;
  }
  getInvitadosConfirmadosAsistentesByPerson(person) {
    let aux = this.temp.filter(
      (inv) =>
        inv.quienInvito === person &&
        inv.estatusDeInvitacion === 'confirmado' &&
        inv.confirmacionAsistencia
    );
    return aux.length;
  }

  getInvitadosNoAsistentesByPerson(person) {
    let aux = this.temp.filter(
      (inv) =>
        inv.quienInvito === person &&
        inv.estatusDeInvitacion === 'confirmado' &&
        !inv.confirmacionAsistencia
    );
    return aux.length;
  }

  search(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.key.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filterTable(filter) {
    let setFilterStatus = () => {
      if (this.isFiltered[0] === filter) {
        return !this.isFiltered[1];
      }
      return true;
    };
    this.isFiltered = [filter, setFilterStatus()];
    if (!this.isFiltered[1] || filter === null || filter === '') {
      this.rows = [...this.temp];
    } else {
      // filter our data
      const temp = this.temp.filter((inv) => {
        return filters[filter](inv);
      });

      // update the rows
      this.rows = temp;
    }
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  getEstatusInvitacion(row) {
    let colors = {
      'no visto': 'warn',
      visto: 'accent',
      confirmado: 'primary',
    };
    return colors[row.estatusDeInvitacion];
  }

  getEstatusInvitacionConfirmadoColor(row) {
    if (row.estatusDeInvitacion === 'confirmado') {
      return row.confirmacionAsistencia ? 'primary' : 'warn';
    }
    return '';
  }

  getEstatusConfirmado(row) {
    let estaConfirmado = row.estatusDeInvitacion === 'confirmado';
    if (estaConfirmado) {
      return row.confirmacionAsistencia ? 'asistira' : 'no asistira';
    }
    return 'sin confirmar';
  }

  isDisplayedColumnColor(columnName) {
    let isDisplayed = this.columnsToDisplay.findIndex(
      (item) => item.name === columnName
    );
    return isDisplayed !== -1 ? 'primary' : 'warn';
  }

  toggleColumn(columnToToggle) {
    let indexOfColumn = this.columns.findIndex(
      (item) => item.name === columnToToggle
    );
    let indexOfColumnDiplayed = this.columnsToDisplay.findIndex(
      (item) => item.name === columnToToggle
    );
    if (indexOfColumnDiplayed !== -1) {
      this.columnsToDisplay = this.columnsToDisplay.filter(
        (item) => item.name !== columnToToggle
      );
    } else {
      this.columnsToDisplay.push(this.columns[indexOfColumn]);
    }
  }

  exportExcel(): void {
    let excelJson: any[] = [];
    this.invitadosList.forEach((invitado) => {
      excelJson.push({
        ...invitado,
        nombre: invitado.nombre,
        telefono: invitado.telefono,
        confirmacionAsistencia: invitado.confirmacionAsistencia ? 'Si' : 'No',
        alergias: invitado.alergias,
      });
      if (invitado.numeroDeInvitadosExtra > 0) {
        invitado.invitadosExtraLista?.forEach((invExtra) => {
          excelJson.push({
            ...invExtra,
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

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  parseExcelFile(): void {
    this.excelService.processExcelFile(this.file);
  }

  exportExcelFromFile(): void {
    this.http.get('/assets/invitados.json').subscribe((res: any) => {
      let excelJson: any[] = [];
      const entries = Object.entries(res.invitados);
      entries.forEach((entry: any) => {
        console.log(entry);
        let invitado: Invitado = { ...entry[1] };
        excelJson.push({
          ...invitado,
          nombre: invitado.nombre,
          telefono: invitado.telefono,
          confirmacionAsistencia: invitado.confirmacionAsistencia ? 'Si' : 'No',
          alergias: invitado.alergias,
        });
        if (invitado.numeroDeInvitadosExtra > 0) {
          invitado.invitadosExtraLista?.forEach((invExtra) => {
            excelJson.push({
              ...invExtra,
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
    });
  }
}
