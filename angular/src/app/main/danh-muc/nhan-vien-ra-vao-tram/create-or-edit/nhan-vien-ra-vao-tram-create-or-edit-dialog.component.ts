import { TramNhanVienDto } from './../../../../../shared/service-proxies/service-proxies';

import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { DMNhanVienRaVaoTramServiceProxy, NhanVienRaVaoTramDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';

@Component({
    selector: 'app-nhan-vien-ra-vao-tram-create-or-edit-dialog',
    templateUrl: './nhan-vien-ra-vao-tram-create-or-edit-dialog.component.html',
    styleUrls: ['./nhan-vien-ra-vao-tram-create-or-edit-dialog.component.scss']
})
export class NhanVienRaVaoTramCreateOrEditDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();
    form: FormGroup;
    isActive = false;
    loading = true;
    saving = false;
    isEdit = false;
    id: number;
    isView = false;
    nhanVien: NhanVienRaVaoTramDto = new NhanVienRaVaoTramDto();
    nhanViens: TramNhanVienDto[] = [];
    constructor(
        injector: Injector,
        public bsModalRef: BsModalRef,
        private _fb: FormBuilder,
        private _dMNhanVienRaVaoTramServiceProxy: DMNhanVienRaVaoTramServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.khoiTaoForm();
        if (this.id) {
            this._dMNhanVienRaVaoTramServiceProxy.getForEdit(this.id, this.isView).subscribe((result) => {
                this.nhanVien = result;
                this._setValueForEdit();
            }, () => { }, () => {
                this.getDataPage();
            });
        }
    }

    getDataPage() {
        this._dMNhanVienRaVaoTramServiceProxy.getListTramByNhanVien(this.id).subscribe(rs => {
            this.nhanViens = rs;
            this.loading = false;
        });
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            hoVaTen: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            maThe: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            soDienThoai: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            email: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            maNhanVien: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            diaChi: [''],
            ghiChu: [''],
        });
    }

    // tslint:disable-next-line:cognitive-complexity
    save() {
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            this._getValueForSave();
            this._dMNhanVienRaVaoTramServiceProxy.
                checkExist(this.nhanVien.maNhanVien, this.nhanVien.email, this.nhanVien.maThe,
                     this.nhanVien.sdt, this.id).subscribe((res) => {
                    switch (res) {
                        case 0: {
                            this._dMNhanVienRaVaoTramServiceProxy
                                .create(this.nhanVien).subscribe((rs) => {
                                    if (rs === 0) {
                                        this.showCreateMessage();
                                        this.bsModalRef.hide();
                                        this.onSave.emit();
                                    } else {
                                        this.showErrorMessage(this.l('qlnv_luukhongthanhcong'));
                                        this.saving = false;
                                    }
                                });
                            break;
                        }

                        case 4: {
                            this._dMNhanVienRaVaoTramServiceProxy
                                .update(this.nhanVien).subscribe((rs) => {
                                    if (rs === 0) {
                                        this.showUpdateMessage();
                                        this.bsModalRef.hide();
                                        this.onSave.emit();
                                    } else {
                                        this.showErrorMessage(this.l('qlnv_capnhatkhongthanhcong'));
                                        this.saving = false;
                                    }
                                });
                            break;
                        }
                        case 1: {
                            this.showExistMessage(this.l('qlnv_manhanviendatontai'));
                            this.saving = false;
                            break;
                        }
                        case 2: {
                            this.showExistMessage(this.l('qlnv_emaildatontai'));
                            this.saving = false;
                            break;
                        }
                        case 3: {
                            this.showExistMessage(this.l('qlnv_mathedatontai'));
                            this.saving = false;
                            break;
                        }

                        case 5: {
                            this.showExistMessage(this.l('qlnv_sodienthoaidatontai'));
                            this.saving = false;
                            break;
                        }
                        default:
                            break;
                    }
                });
        }
    }
    private _getValueForSave() {
        this.nhanVien.ten = this.form.controls.hoVaTen.value;
        this.nhanVien.email = this.form.controls.email.value;
        this.nhanVien.maNhanVien = this.form.controls.maNhanVien.value;
        this.nhanVien.maThe = this.form.controls.maThe.value;
        this.nhanVien.sdt = this.form.controls.soDienThoai.value;
        this.nhanVien.diaChi = this.form.controls.diaChi.value;
        this.nhanVien.ghiChu = this.form.controls.ghiChu.value;
    }

    private _setValueForEdit() {
        this.form.controls.hoVaTen.setValue(this.nhanVien.ten);
        this.form.controls.email.setValue(this.nhanVien.email);
        this.form.controls.maNhanVien.setValue(this.nhanVien.maNhanVien);
        this.form.controls.maThe.setValue(this.nhanVien.maThe);
        this.form.controls.soDienThoai.setValue(this.nhanVien.sdt);
        this.form.controls.diaChi.setValue(this.nhanVien.diaChi);
        this.form.controls.ghiChu.setValue(this.nhanVien.ghiChu);
        if (this.isView) {
            this.form.disable();
        }
    }

    close() {
        this.bsModalRef.hide();
    }
}
