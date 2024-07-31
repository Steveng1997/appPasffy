import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})

export class SearchPipe implements PipeTransform {

  transform(items: any[], param: string): any {

    if (!param || param === undefined) return items;
    if (!items) return [];

    return Object.values(items).filter(item => {
      return item.therapist.match(param.slice(0)) || item.manager.match(param.slice(0))
        || item.dateStart.substring(0, 10).match(param.slice(0)) || item.dateStart.substring(11, 16).match(param.slice(0))
        || item.dateEnd.substring(11, 16).match(param.slice(0)) || item.client.match(param.slice(0))
        || item.exit.match(param.slice(0)) || item.payment.match(param.slice(0))
    });
  }
}