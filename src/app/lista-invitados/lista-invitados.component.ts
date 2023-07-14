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

  get getNoVistos() {
    if (this.invitadosList) {
      let noVistos = this.invitadosList.filter(
        (invitado) =>
          invitado.estatusDeInvitacion.toLocaleLowerCase() === 'no visto'
      );
      return noVistos.length;
    }
    return 0;
  }
  get getVistos() {
    if (this.invitadosList) {
      let vistos = this.invitadosList.filter(
        (invitado) =>
          invitado.estatusDeInvitacion.toLocaleLowerCase() === 'visto'
      );
      return vistos.length;
    }
    return 0;
  }
  get getConfirmados() {
    if (this.invitadosList) {
      let noVistos = this.invitadosList.filter(
        (invitado) =>
          invitado.estatusDeInvitacion.toLocaleLowerCase() === 'confirmado'
      );
      return noVistos.length;
    }
    return 0;
  }
  get getAsistentes() {
    if (this.invitadosList) {
      let asistiran = this.invitadosList.filter(
        (invitado) =>
          invitado.confirmacionAsistencia &&
          invitado.estatusDeInvitacion === 'confirmado'
      );
      return asistiran.length;
    }
    return 0;
  }
  get getNoAsistentes() {
    if (this.invitadosList) {
      let noAsistiran = this.invitadosList.filter(
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
    if (!this.isFiltered[1]) {
      this.rows = [...this.temp];
    } else {
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
      };

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
