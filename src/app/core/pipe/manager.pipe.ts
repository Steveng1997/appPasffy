import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'manager',
  standalone: true
})

export class ManagerPipe implements PipeTransform {

  transform(items: any[], param: string): any {
    if (!param || param?.length < 1) {
      return items;
    }

    if (items) {
      return Object.values(items).filter((item, index) => item.manager === param);
    }
  }
}