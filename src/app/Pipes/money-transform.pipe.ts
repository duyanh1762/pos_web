import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyTransform'
})
export class MoneyTransformPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (value === null || value === undefined) return '';

    // Chuyển đổi giá trị thành số nếu có thể
    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      return ''; // Trả về chuỗi rỗng nếu giá trị không phải là số hợp lệ
    }

    return numberValue.toLocaleString('vi-VN');
  }

}
