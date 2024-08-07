import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethod',
  standalone: true
})

export class PaymentMethodPipe implements PipeTransform {

  transform(items: any[], param: string): any {

    if (!param || param?.length < 1) {
      return items;
    }

    if (items) {
      return Object.values(items).filter((item, index) => item.payment.indexOf(param) > -1);
    }
  }
}