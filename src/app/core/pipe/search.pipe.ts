import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})

export class SearchPipe implements PipeTransform {

  transform(items: any, param: string): any {

    if (!param || param === undefined) return items;
    if (!items) return [];

    if (items) {
      return items.filter((item) => item.terapeuta.match(param.slice(0))
        || item.encargada.match(param.slice(0)) || item.fecha.match(param.slice(0))
        || item.horaStart.match(param.slice(0)) || item.horaEnd.match(param.slice(0))
        || item.cliente.match(param.slice(0)) || item.salida.match(param.slice(0))
        || item.formaPago.match(param.slice(0)));
    }
  }
}