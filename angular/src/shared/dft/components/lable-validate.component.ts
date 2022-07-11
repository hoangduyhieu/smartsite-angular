// tslint:disable
import { ElementRef, AfterViewInit, Input, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: '<dft-label-validation>',
    template: `  <label
                    [class]="control?.errors && ( control?.touched || control?.dirty)  ? 'text-danger' : 'text-ok'"  id="control">{{title}}
                </label>
                <label style='color: #dc3545 !important;'>{{titleValidate}}
                </label>
    `
})
export class LabelValidationComponent {
    @Input() form: FormGroup;
    @Input() control: FormControl;
    @Input() title: '';
    @Input() titleValidate: '';
    constructor() {

    }
}
