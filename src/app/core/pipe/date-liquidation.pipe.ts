import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateLiquidation'
})

export class DateLiquidationPipe implements PipeTransform {

  transform(items: any[], paramFechaInicial: string, paramFechaFinal: string): any {
    if (!paramFechaInicial || paramFechaInicial?.length < 1) {
      return items;
    }

    if (items) {
      if (paramFechaInicial === undefined && paramFechaFinal === undefined) return
      if (paramFechaInicial === undefined) return items.filter((item, index) => item.desdeFechaLiquidado <= paramFechaFinal)
      if (paramFechaFinal === undefined) return items.filter((item, index) => item.desdeFechaLiquidado === paramFechaInicial)
      return items.filter((item, index) => item.desdeFechaLiquidado >= paramFechaInicial && item.desdeFechaLiquidado <= paramFechaFinal)
    }
  }
}