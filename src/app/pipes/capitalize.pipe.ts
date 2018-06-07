import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string, all:boolean = true): string {

    value = value.toLowerCase();

    let content = value.split(" ");

    if (all) {
      for(let i in content) {
        content[i]= content[i][0].toUpperCase() + content[i].substr(1);
      }
    } else {
      content[0] = content[0][0].toUpperCase() + content[0].substr(1);
    }

    return content.join(" ");
  }
}
