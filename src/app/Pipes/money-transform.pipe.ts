import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyTransform'
})
export class MoneyTransformPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (value === null || value === undefined) return '';

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      return '';
    }

    return numberValue.toLocaleString('vi-VN');
  }

}
