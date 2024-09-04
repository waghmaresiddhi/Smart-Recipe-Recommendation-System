import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlToFilename'
})
export class UrlToFilenamePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    
    if (value) {
      var m = value.toString().match(/\/([^\/?#]+)[^\/]*$/);
      if (m && m.length > 1) {
        return m[1];
      }
    }
    return "Unknown File";
  }

}
