import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize'
})
export class FilesizePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return value >= 1000000 ? `${value / 1000000} MBs` : value >= 1000 ? `${value / 1000} KBs` : `${value}Bs` ;
  }

}
