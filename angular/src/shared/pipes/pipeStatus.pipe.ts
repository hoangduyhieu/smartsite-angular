import { Injector, Pipe, PipeTransform } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';


@Pipe({
    name: 'pipeStatus'
})
export class PipeStatus extends AppComponentBase implements PipeTransform {

    constructor(injector: Injector) {
        super(injector);
    }

    transform(key: string): string {
        let rs: string;
        if (this.language === 'vi') {
            switch (key) {
                case 'ACTIVE_UNACK': {
                    rs = 'Chưa xử lý - Chưa xác nhận';
                    break;
                }
                case 'ACTIVE_ACK': {
                    rs = 'Chưa xử lý - Đã xác nhận';
                    break;
                }
                case 'CLEARED_UNACK': {
                    rs = 'Đã xử lý - Chưa xác nhận';
                    break;
                }
                case 'CLEARED_ACK': {
                    rs = 'Đã xử lý - Đã xác nhận';
                    break;
                }
            }
        } else {
            rs = key;
        }

        return rs;
    }
}
