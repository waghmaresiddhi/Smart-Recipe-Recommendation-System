import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isSvg'
})
export class IsSvgPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (!value) {
      return false
    }
    return value.includes('<svg') ? true : false;
  }

}
