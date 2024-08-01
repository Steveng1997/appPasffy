import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'therapist',
  standalone: true
})

export class TherapistPipe implements PipeTransform {

  transform(items: any[], param: string): any {
    if (!param || param?.length < 1) {
      return items;
    }

    if (items) {
      return  Object.values(items).filter((item) => item.therapist === param)
    }
  }
}