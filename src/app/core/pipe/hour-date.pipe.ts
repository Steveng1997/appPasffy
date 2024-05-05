import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourDate',
  standalone: true
})
export class HourDatePipe implements PipeTransform {

  parmHourStart: string
  parmHourEnd: string

  transform(items: any[], paramFechaInicial: string, paramHoraInicial: string, paramFechaFinal: string, paramHoraFinal: string): any {
    if (!paramHoraInicial || paramHoraInicial?.length < 1) {
      return items;
    }

    this.parmHourStart = `${paramFechaInicial} ${paramHoraInicial}`
    this.parmHourEnd = `${paramFechaFinal} ${paramHoraFinal}`

    if (items) {
      if (paramHoraInicial === undefined && paramHoraFinal === undefined) return
      if (paramHoraInicial === undefined) return items.filter((item, index) => item.horaEnd <= paramHoraFinal)
      if (paramHoraFinal === undefined) return items.filter((item, index) => item.horaStart === paramHoraInicial)
      return items.filter((item, index) => `${item.fechaHoyInicio} ${item.horaStart}` >= this.parmHourStart && `${item.fechaHoyInicio} ${item.horaEnd}` <= this.parmHourEnd)
    }
  }
}