import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
    DMNguoiNhanCanhBaoServiceProxy,
    NguoiNhanCanhBaoCreateInput
} from '@shared/service-proxies/service-proxies';
import {AppComponentBase} from '@shared/app-component-base';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {CommonComponent} from '@shared/dft/components/common.component';
import {finalize} from 'rxjs/operators';
import {ValidationComponent} from '../../../../../shared/dft/components/validation-messages.component';

@Component({
    selector: 'app-nguoi-nhan-canh-bao-create-or-edit-dialog',
    templateUrl: './nguoi-nhan-canh-bao-create-or-edit-dialog.component.html',
    styleUrls: ['./nguoi-nhan-canh-bao-create-or-edit-dialog.component.scss'],
})
export class NguoiNhanCanhBaoCreateOrEditDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();
    form: FormGroup;
    saving = false;
    isEdit = false;
    nguoiNhanCanhBaoDto: NguoiNhanCanhBaoCreateInput = new NguoiNhanCanhBaoCreateInput();
    id: number;
    isView: boolean;

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public bsModalRef: BsModalRef,
        private _nguoiNhanCanhBaoService: DMNguoiNhanCanhBaoServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.khoiTaoForm();
        if (!this.id) {
            // Thêm mới
            this.nguoiNhanCanhBaoDto = new NguoiNhanCanhBaoCreateInput();
            this.isEdit = false;
        } else {
            this.isEdit = true;
            // Sửa
            this._nguoiNhanCanhBaoService.get(this.id).subscribe(item => {
                this.nguoiNhanCanhBaoDto = item;
                this._setValueForEdit();
            });
        }
        if (this.isView) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            // sdt hop le : +84..., (+84)..., 123456...  : độ dài phần số trong khoảng 7-15 kí tự
            InputSdt: ['', [Validators.required,
                Validators.pattern('^((((\\+84)?)|(\\(\\+84\\))?)?[0-9]{7,15})$')]],
            // email hop le : kitu@kitu.kitu.kitu
            InputEmail: ['', [Validators.required,
                Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{1,})+$'),
                Validators.maxLength(256)]],
            InputTen: ['', [Validators.required,
                ValidationComponent.KtraKhoangTrang,
                Validators.maxLength(50)]],
            InputGhiChu: [],
        });
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') { // kiểm tra xem form có lỗi k
            this.saving = true;
            this._getValueForSave();
            this._nguoiNhanCanhBaoService.createOrEdit(this.nguoiNhanCanhBaoDto).pipe(
                finalize(() => {
                    this.saving = false;
                })
            ).subscribe((result) => {
                if (result === -1) {
                    this.showExistMessage('Số điện thoại không hợp lệ');
                } else if (result === -2) {
                    this.showExistMessage('Email không hợp lệ');
                } else if (result === -3) {
                    this.showExistMessage('Số điện thoại đã tồn tại');
                } else if (result === -4) {
                    this.showExistMessage(' Email đã tồn tại');
                } else if (!this.id) {
                    this.showCreateMessage();
                    this.bsModalRef.hide();
                    this.onSave.emit();
                } else {
                    this.showUpdateMessage();
                    this.bsModalRef.hide();
                    this.onSave.emit();
                }
            });
        }
    }

    close() {
        this.bsModalRef.hide();
    }

    private _setValueForEdit() {
        this.form.controls.InputSdt.setValue(this.nguoiNhanCanhBaoDto.sdt);
        this.form.controls.InputEmail.setValue(this.nguoiNhanCanhBaoDto.email);
        this.form.controls.InputTen.setValue(this.nguoiNhanCanhBaoDto.ten);
        this.form.controls.InputGhiChu.setValue(this.nguoiNhanCanhBaoDto.ghiChu);
    }


    private _getValueForSave() {
        this.nguoiNhanCanhBaoDto.sdt = this.form.controls.InputSdt.value;
        this.nguoiNhanCanhBaoDto.email = this.form.controls.InputEmail.value;
        this.nguoiNhanCanhBaoDto.ten = this.form.controls.InputTen.value;
        this.nguoiNhanCanhBaoDto.ghiChu = this.form.controls.InputGhiChu.value;
    }

}
