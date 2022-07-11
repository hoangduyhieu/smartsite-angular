// tslint:disable
import { Component, Injector, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { extend } from 'lodash';
@Component({
    selector: '<dft-validation>',
    template: `
     <div class="valid-height">
                <div *ngIf="control?.touched || control?.dirty "> 
                    <span  class="text-danger" >
                     {{message1}}
                    </span>
                </div>
    </div>
    `
})
export class ValidationComponent extends AppComponentBase {

    public static KtraSoNguyen(control: AbstractControl) {
        try {
            // nếu k phai số trả về true
            if (control.value != null) {
                if (/[^0-9]+/.test(control.value)) {
                    return { pattern: true };
                }
            }
            return null;
        } catch (error) {

        }
    }

    public static KtraIPAdress(control: AbstractControl) {
        try {
            // nếu k phai số trả về true
            if (control.value != null) {
                if (/[^0-9.]+/.test(control.value)) {
                    return { pattern: true };
                }
            }
            return null;
        } catch (error) {

        }
    }

    @Input() control;
    constructor(injector: Injector) {
        super(injector);
    }
    get message1() {
        try {
            if (this.control.errors) {
                for (const err in this.control.errors) {
                    if (this.control.errors.hasOwnProperty(err)) {
                        return this.getErrorMessage(err);
                    }
                }
            }
        } catch (error) {

        }
    }

    // kiểm tra dấu cách - nếu có dấu cách là lỗi
    public static KtraKhoangTrang(control: AbstractControl) {
        try {
            // nếu k phai số trả về true
            if (control.value != null) {
                if (control.value.trim().length == 0) {
                    return { required: true };
                }
            }
            return null;
        } catch (error) {

        }
    }
    
    getErrorMessage(err) {
        const messages = {
            'required': this.l('ThisFieldIsRequired'), // Đây là trường bắt buộc
            'isEndMin': this.l('isEndMin'), // Thời gian phải lớn hơn hoặc bằng ngày bắt đầu
            'isStartMax': this.l('isStartMax'), // Thời gian phải nhỏ hơn hoặc bằng ngày kết thúc
            'isMax': this.l('isMax'),   // Thời gian phải nhỏ hơn hoặc bằng ngày hiện tại
            'pattern': this.l('pattern'),   // Không đúng định dạng
            'isMin': this.l('isMin'),   // Thời gian phải lớn hơn hoặc bằng ngày hiện tại
            'isStartMaxLtg': this.l('isStartMaxLtg'), // Thời gian phải nhỏ hơn ngày kết thúc
            'isEndMinLtg': this.l('isEndMinLtg'), // Thời gian phải lớn hơn ngày bắt đầu
            'isDenNgaymax': this.l('isDenNgaymax'), // Thời gian phải nhỏ hơn thời gian đến ngày
            'isTuNgaymin': this.l('isTuNgaymin'), // Thời gian phải lớn hơn thời gian từ ngày
            'email': this.l('email'), // Email không đúng định dạng
            'phone': this.l('phone'), // SĐT không đúng định dạng
            'url': this.l('url'), // URL không đúng định dạng
            'DenNgayIsNull': this.l('DenNgayIsNull'), // Thời gian đến ngày không được để trống
            'passWordLength': this.l('passWordLength'),
        };
        return messages[err];
    }
}
