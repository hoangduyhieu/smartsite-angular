import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceSpace'
})
export class ReplaceSpacePipe implements PipeTransform {

  transform(value: any) {
    if (!value) {
        return '';
    }

    return value.replace(/\s/g, '');
}

}
