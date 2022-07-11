import { Injector, Pipe, PipeTransform } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';


@Pipe({
    name: 'changeType'
})
export class ChangeType extends AppComponentBase implements PipeTransform {

    constructor(injector: Injector) {
        super(injector);
    }

    transform(key: string): string {
        let rs: string;
        if (this.language === 'vi') {
            switch (key) {
                case 'CRITICAL': {
                    rs = 'NGHIÊM TRỌNG';
                    break;
                }
                case 'MAJOR': {
                    rs = 'NGUY HIỂM';
                    break;
                }
                case 'MINOR': {
                    rs = 'TRUNG BÌNH';
                    break;
                }
                case 'WARNING': {
                    rs = 'CHÚ Ý';
                    break;
                }
                case 'INDETERMINATE': {
                    rs = 'KHÔNG XÁC ĐỊNH';
                    break;
                }
            }
        } else {
            rs = key;
        }

        return rs;
    }
}
