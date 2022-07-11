
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';
import { FileDownloadService } from '@shared/file-download.service';
import { CreateOrEditMauCanhBao, DMMauCanhBaoServiceProxy, DMMauThuocTinhServiceProxy, KieuDuLieuLookupTable, MauCanhBaoThuocTinh } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SelectItem } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-mau-canh-bao-create-or-edit-dialog',
    templateUrl: './mau-canh-bao-create-or-edit-dialog.component.html',
    // styleUrls: ['./mau-canh-bao-create-or-edit-dialog.component.scss']
})
export class MauCanhbaoCreateOrEditDialogComponent extends AppComponentBase implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    form: FormGroup;
    saving = false;
    isEdit = false;
    id: number;
    isView: boolean;
    input: CreateOrEditMauCanhBao = new CreateOrEditMauCanhBao();
    arrKieuDuLieu: KieuDuLieuLookupTable[] = [];
    public thamDuList: FormArray;
    optionKieuDuLieu: SelectItem[] = [];

    cities = [
        { id: '1', label: 'True' },
        { id: '2', label: 'False' },
    ];

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public http: HttpClient,
        private _fileDownloadService: FileDownloadService,
        private _mauCanhBaoService: DMMauCanhBaoServiceProxy,
        private _mauThuocTinhService: DMMauThuocTinhServiceProxy,
        public bsModalRef: BsModalRef,
    ) {
        super(injector);
    }

    setValid(index?: number, skill?: any) {
        const b = this.optionKieuDuLieu.find(e => e.value === skill.value.txtThuocTinh).title;
        this.skills.at(index).get('txtGiaTriBoolean').reset();
        this.skills.at(index).get('txtGiaTriString').reset();
        this.skills.at(index).get('txtGiaTriLong').reset();
        this.skills.at(index).get('txtGiaTriDouble').reset();

        if (b === '1') {
            this.skills.at(index).get('txtGiaTriBoolean').setErrors({ required: true });
            this.skills.at(index).get('txtGiaTriBoolean').setValidators([Validators.required]);
        } else {
            this.skills.at(index).get('txtGiaTriBoolean').setErrors(null);
        }

        if (b === '2') {
            this.skills.at(index).get('txtGiaTriString').setErrors({ required: true });
            this.skills.at(index).get('txtGiaTriString').setValidators([Validators.required]);
        } else {
            this.skills.at(index).get('txtGiaTriString').setErrors(null);
        }

        if (b === '5') {
            this.skills.at(index).get('txtGiaTriString').setErrors({ required: true });
            this.skills.at(index).get('txtGiaTriString').setValidators([Validators.required]);
        } else {
            this.skills.at(index).get('txtGiaTriString').setErrors(null);
        }

        if (b === '3') {
            this.skills.at(index).get('txtGiaTriLong').setErrors({ required: true });
            this.skills.at(index).get('txtGiaTriLong').setValidators([Validators.required]);
        } else {
            this.skills.at(index).get('txtGiaTriLong').setErrors(null);
        }

        if (b === '4') {
            this.skills.at(index).get('txtGiaTriDouble').setErrors({ required: true });
            this.skills.at(index).get('txtGiaTriDouble').setValidators([Validators.required]);
        } else {
            this.skills.at(index).get('txtGiaTriDouble').setErrors(null);
        }
    }


    ngOnInit() {
        this.khoiTaoForm();
        this._mauThuocTinhService.getAllLookupTableThuocTinh().subscribe(rs => {
            this.arrKieuDuLieu = rs;
            rs.forEach(e => {
                this.optionKieuDuLieu.push
                    ({
                        label: e.displayName,
                        value: e.id,
                        disabled: e.disabled,
                        title: e.kieuDuLieu.toString(),
                    });
            });

            if (!this.id) {
                // Thêm mới
                this.input = new CreateOrEditMauCanhBao();
                this.isEdit = false;
            } else {
                this.isEdit = true;
                // Sửa
                this._mauCanhBaoService.getForEdit(this.id, this.isView).subscribe(item => {
                    this.input = item;
                    this._setValueForEdit();
                });
                if (this.isView) {
                    this.form.disable();
                } else {
                    this.form.enable();
                }
            }
        });
    }

    checkDisable() {
        this.form.controls.skills.value.forEach(element => {
            if (this.optionKieuDuLieu.find(e => e.value === element.txtThuocTinh) !== undefined) {
                this.optionKieuDuLieu.find(e => e.value === element.txtThuocTinh).disabled = true;
            }
        });
    }

    resetOptions(a: any) {
        this.optionKieuDuLieu.forEach(item => {
            item.disabled = false;
        });
        this.checkDisable();
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            txtMaMau: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            txtTenMauDieuKhien: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            skills: this._fb.array([this.newSkill()]),
            txtGhiChu: [''],
        });

        this.thamDuList = this.form.get('skills') as FormArray;
        while (this.thamDuList.length !== 0) {
            this.thamDuList.removeAt(0);
        }
    }

    newSkill(): FormGroup {
        return this._fb.group({
            txtThuocTinh: [undefined, Validators.required],
            txtGiaTriLong: [undefined],
            txtGiaTriDouble: [undefined],
            txtGiaTriBoolean: [undefined],
            txtGiaTriString: [undefined, { validators: [ValidationComponent.KtraKhoangTrang] }],
        });
    }

    get skills(): FormArray {
        return this.form.get('skills') as FormArray;
    }

    addSkills() {
        this.thamDuList.push(this.newSkill());
    }

    removeSkill(i: number) {
        if (this.optionKieuDuLieu.find(e => e.value === this.thamDuList.value[i].txtThuocTinh) !== undefined) {
            this.optionKieuDuLieu.find(e => e.value === this.thamDuList.value[i].txtThuocTinh).disabled = false;
        }
        this.thamDuList.removeAt(i);
    }

    changeForm() {

    }

    close() {
        this.bsModalRef.hide();
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            this._getValueForSave();
            this._mauCanhBaoService.createOrEdit(this.input).pipe(
                finalize(() => {
                    this.saving = false;
                })
            ).subscribe((result) => {
                if (!this.id) {
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

    private _getValueForSave() {
        this.input.ten = this.form.controls.txtTenMauDieuKhien.value;
        this.input.maMau = this.form.controls.txtMaMau.value;
        this.input.ghiChu = this.form.controls.txtGhiChu.value;
        this.input.mauCanhBaoThuocTinh = [];
        this.form.controls.skills.value.forEach(item => {
            const optionArray = this.optionKieuDuLieu.find(e => e.value === item.txtThuocTinh);
            const inputCollection = new MauCanhBaoThuocTinh();
            inputCollection.mauThuocTinhId = optionArray.value;
            if (optionArray.title === '1') {
                inputCollection.boolValue = item.txtGiaTriBoolean?.label;
            } else if (optionArray.title === '2') {
                inputCollection.stringValue = item.txtGiaTriString;
            } else if (optionArray.title === '3') {
                inputCollection.longValue = item.txtGiaTriLong;
            } else if (optionArray.title === '4') {
                inputCollection.doubleValue = item.txtGiaTriDouble;
            } else {
                inputCollection.jsonValue = item.txtGiaTriString;
            }
            this.input.mauCanhBaoThuocTinh.push(inputCollection);
        });
    }

    // tslint:disable-next-line:cognitive-complexity
    private _setValueForEdit() {
        this.form.controls.txtTenMauDieuKhien.setValue(this.input.ten);
        this.form.controls.txtMaMau.setValue(this.input.maMau);
        this.form.controls.txtGhiChu.setValue(this.input.ghiChu);
        for (const item of this.input.mauCanhBaoThuocTinh) {
            const a = this.newSkill();
            const itemThuocTinh = item.mauThuocTinhId;
            const check = this.optionKieuDuLieu.find(e => e.value === itemThuocTinh);
            if (check !== undefined) {
                this.optionKieuDuLieu.find(e => e.value === itemThuocTinh).disabled = true;
            }

            if (item.boolValue !== null) {
                a.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
                a.controls.txtGiaTriBoolean.setValue(this.cities.find(e => e.label.toLowerCase() === item.boolValue.toString()));
                if (this.isView) {
                    a.controls.txtGiaTriBoolean.disable();
                }
            } else if (item.stringValue !== null) {
                a.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
                a.controls.txtGiaTriString.setValue(item.stringValue);
                if (this.isView) {
                    a.controls.txtGiaTriString.disable();
                }
            } else if (item.longValue !== null) {
                a.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
                a.controls.txtGiaTriLong.setValue(item.longValue);
                if (this.isView) {
                    a.controls.txtGiaTriLong.disable();
                }
            } else if (item.doubleValue !== null) {
                a.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
                a.controls.txtGiaTriDouble.setValue(item.doubleValue);
                if (this.isView) {
                    a.controls.txtGiaTriDouble.disable();
                }
            } else {
                a.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
                a.controls.txtGiaTriString.setValue(item.jsonValue);
                if (this.isView) {
                    a.controls.txtGiaTriString.disable();
                }
            }
            this.skills.push(a);
        }
    }
}
