import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Invitado } from './database.service';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelServiceService {
  constructor() {}
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // save to file
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${excelFileName}.${EXCEL_EXTENSION}`);
  }

  public processExcelFile(file: File): void {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data: Uint8Array = new Uint8Array(e.target.result);
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

      // Assuming there is only one sheet in the Excel file
      const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert the worksheet to JSON format
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 0,
        blankrows: false,
      });
      console.log(jsonData);

      let keyValidatorArray: any = [];
      let newJson: any = {
        invitados: {},
      };

      for (let index = 0; index < jsonData.length; index++) {
        const invitado = jsonData[index];
        const invitadoKey = this.getInvitadoKey(invitado, keyValidatorArray);
        let auxInvitadoObj: Invitado = {
          id: invitado.id,
          alergias: '',
          confirmacionAsistencia: false,
          estatusDeInvitacion: 'no visto',
          invitadoCivil: invitado.civil,
          nombre: invitado.nombre,
          numeroDeInvitadosExtra: invitado.numeroDeInvitadosExtra - 1,
          invitadosExtraLista: [],
          quienInvito: invitado.quienInvito,
          telefono: invitado.telefono,
          adultoOJoven: invitado.adultoOJoven,
          quienInvita: invitado.quienInvita,
          posibleNoAsistencia: invitado.posibleNoAsistencia === '1',
          nombreEnInvitacion: invitado.nombreEnInvitacion,
          sexo: invitado.sexo,
          url: 'https://violetaycarlos.com/inicio/' + invitadoKey,
        };
        const hasInvitadoExtra = invitado.numeroDeInvitadosExtra - 1 > 0;
        if (hasInvitadoExtra) {
          for (let y = 0; y < invitado.numeroDeInvitadosExtra - 1; y++) {
            index++;
            const invExtra = jsonData[index];
            const invitadoExtraAux: Invitado = {
              nombre: invExtra.nombre || '',
              telefono: invExtra.telefono || '',
              alergias: '',
              confirmacionAsistencia: false,
              adultoOJoven: invExtra.adultoOJoven || '',
              sexo: invExtra.sexo,
              posibleNoAsistencia: invExtra.posibleNoAsistencia === '1',
            };
            auxInvitadoObj.invitadosExtraLista.push(invitadoExtraAux);
          }
        }

        newJson.invitados[invitadoKey] = auxInvitadoObj;
      }

      console.log(
        '🚀 ~ file: excel-service.service.ts:86 ~ ExcelServiceService ~ processExcelFile ~ newJson:',
        newJson
      );
      var a = document.createElement('a');
      a.setAttribute(
        'href',
        'data:text/plain;charset=utf-u,' + encodeURIComponent(JSON.stringify(newJson))
      );
      a.setAttribute('download', 'invitadosJson.json');
      a.click();
    };

    // Read the file as an array buffer
    reader.readAsArrayBuffer(file);
  }

  getInvitadoKey(invitado, keyValidatorArray) {
    let newKey = invitado.nombre.replace(/\s/g, '');
    newKey = newKey.replace(/\./g, '');
    newKey = newKey.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    newKey = newKey.toLowerCase();
    if (keyValidatorArray.includes(newKey)) {
      let increment = 1;
      while (keyValidatorArray.includes(newKey)) {
        newKey = newKey + increment;
        increment++;
      }
    }
    keyValidatorArray.push(newKey);
    return newKey;
  }
}
