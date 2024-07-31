import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  standalone: true
})

export class DatePipe implements PipeTransform {

  transform(items: any[], paramFechaInicial: string, paramFechaFinal: string): any {
    if (!paramFechaInicial || paramFechaInicial?.length < 1) {
      return items;
    }

    if (items) {
      if (paramFechaInicial === undefined && paramFechaFinal === undefined) return
      if (paramFechaInicial === undefined) return items.filter((item, index) => item.dateToday.substring(0, 10) <= paramFechaFinal)
      if (paramFechaFinal === undefined) return items.filter((item, index) => item.dateToday.substring(0, 10) === paramFechaInicial)
      return Object.values(items).filter((item) => item.dateToday.substring(0, 10) >= paramFechaInicial && item.dateToday.substring(0, 10) <= paramFechaFinal)
    }
  }
}