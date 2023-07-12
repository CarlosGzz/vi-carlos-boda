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
    { name: 'telefono'},
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

  constructor(
    private invitadosService: DatabaseService,
    private excelService: ExcelServiceService,
    private formBuilder: FormBuilder
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
          auxRows.push(invExtraRow);
        });
      }
    });
    console.log(
      '🚀 ~ file: lista-invitados.component.ts:105 ~ ListaInvitadosComponent ~ mapRows ~ auxRows:',
      auxRows
    );
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

  updateFilter(event) {
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

  isDisplayedColumnColor(columnName) {
    let isDisplayed= this.columnsToDisplay.findIndex(item => item.name === columnName);
    return isDisplayed !== -1  ? 'primary':'warn'
  }

  toggleColumn(columnToToggle) {
    let indexOfColumn = this.columns.findIndex(item => item.name === columnToToggle);
    let indexOfColumnDiplayed = this.columnsToDisplay.findIndex(item => item.name === columnToToggle);
    if(indexOfColumnDiplayed !== -1) {
      this.columnsToDisplay = this.columnsToDisplay.filter(item => item.name !== columnToToggle);
    }else {
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
}
