import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injector, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';
import { FileDownloadService } from '@shared/file-download.service';
import {
    CreateOrEditDanhMucTramDto,
    DMMauThuocTinhServiceProxy,
    DMTramServiceProxy, KieuDuLieuLookupTable, MauDieuKhienThuocTinh, TramDieuKhienThuocTinh, TramDto
} from '@shared/service-proxies/service-proxies';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SelectItem } from 'primeng';
import { finalize } from 'rxjs/operators';
@Component({
    selector: 'app-mau-dieu-khien-tram',
    templateUrl: './create-or-edit-mau-dieu-khien-tram.component.html',
    animations: [appModuleAnimation()],
})
export class CreateOrEditMauDieuKhienTramComponent extends AppComponentBase implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    input: CreateOrEditDanhMucTramDto = new CreateOrEditDanhMucTramDto();
    form: FormGroup;
    saving = false;
    isEdit = false;
    id: number;
    tramId: number;
    isView: boolean;
    record: TramDieuKhienThuocTinh;
    arrKieuDuLieu: KieuDuLieuLookupTable[] = [];
    optionKieuDuLieu: SelectItem[] = [];
    idRecord: number;
    sorted: string;
    cities = [
        { id: '1', label: 'True' },
        { id: '2', label: 'False' },
    ];
    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public http: HttpClient,
        public bsModalRef: BsModalRef,
        private _mauThuocTinhService: DMMauThuocTinhServiceProxy,
        private _dmTramAppService: DMTramServiceProxy,
    ) { super(injector); }

    ngOnInit(): void {
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
            if (!this.record) {
                // Thêm mới
                this.input = new CreateOrEditDanhMucTramDto();
                this.isEdit = false;
            } else {
                this.isEdit = true;
                // Sửa
                this._setValueForEdit();
            }
        });

        this.form.controls.txtThuocTinh.valueChanges.subscribe(w => {
            if (w !== undefined && w !== null) {
                this.checkValid();
            }
        });
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            txtThuocTinh: [undefined, Validators.required],
            txtGiaTriLong: [],
            txtGiaTriDouble: [],
            txtGiaTriBoolean: [],
            txtGiaTriString: [],
        });
    }

    close() {
        this.bsModalRef.hide();
    }

    checkValid() {
        this.form.controls.txtGiaTriBoolean.reset();
        this.form.controls.txtGiaTriDouble.reset();
        this.form.controls.txtGiaTriLong.reset();
        this.form.controls.txtGiaTriString.reset();
        const optionArray = this.optionKieuDuLieu.find(e => e.value === this.form.controls.txtThuocTinh.value);
        if (optionArray.title === '1') {
            this.form.controls.txtGiaTriBoolean.setValidators([
                Validators.required,
            ]);
            this.form.controls.txtGiaTriDouble.setValidators([]);
            this.form.controls.txtGiaTriLong.setValidators([]);
            this.form.controls.txtGiaTriString.setValidators([]);
        }

        if (optionArray.title === '2' || optionArray.title === '5') {
            this.form.controls.txtGiaTriString.setValidators([
                Validators.required, ValidationComponent.KtraKhoangTrang
            ]);
            this.form.controls.txtGiaTriDouble.setValidators([]);
            this.form.controls.txtGiaTriLong.setValidators([]);
            this.form.controls.txtGiaTriBoolean.setValidators([]);
        }

        if (optionArray.title === '3') {
            this.form.controls.txtGiaTriLong.setValidators([
                Validators.required,
            ]);
            this.form.controls.txtGiaTriDouble.setValidators([]);
            this.form.controls.txtGiaTriString.setValidators([]);
            this.form.controls.txtGiaTriBoolean.setValidators([]);
        }

        if (optionArray.title === '4') {
            this.form.controls.txtGiaTriDouble.setValidators([
                Validators.required,
            ]);
            this.form.controls.txtGiaTriString.setValidators([]);
            this.form.controls.txtGiaTriLong.setValidators([]);
            this.form.controls.txtGiaTriBoolean.setValidators([]);
        }
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            this._getValueForSave();
            if (!this.record) {
                this._dmTramAppService.createMauDieuKhienTram(this.input).pipe(
                    finalize(() => {
                        this.saving = false;
                    })
                ).subscribe(rs => {
                    this.showCreateMessage();
                    this.bsModalRef.hide();
                    this.onSave.emit();
                });
            } else {
                this._dmTramAppService.updateMauDieuKhienTram(this.idRecord, this.sorted, this.input).pipe(
                    finalize(() => {
                        this.saving = false;
                    })
                ).subscribe(rs => {
                    this.showUpdateMessage();
                    this.bsModalRef.hide();
                    this.onSave.emit();
                });
            }
        }
    }

    private _getValueForSave() {
        this.input.tramDieuKhienThuocTinh = [];
        this.input.id = this.tramId;
        const optionArray = this.optionKieuDuLieu.find(e => e.value === this.form.controls.txtThuocTinh.value);
        const inputCollection = new TramDieuKhienThuocTinh();
        inputCollection.mauThuocTinhId = optionArray.value;
        inputCollection.tramId = this.tramId;
        if (optionArray.title === '1') {
            inputCollection.boolValue = this.form.controls.txtGiaTriBoolean.value?.label;
        } else if (optionArray.title === '2') {
            inputCollection.stringValue = this.form.controls.txtGiaTriString.value;
        } else if (optionArray.title === '3') {
            inputCollection.longValue = this.form.controls.txtGiaTriLong.value;
        } else if (optionArray.title === '4') {
            inputCollection.doubleValue = this.form.controls.txtGiaTriDouble.value;
        } else {
            inputCollection.jsonValue = this.form.controls.txtGiaTriString.value;
        }
        this.input.tramDieuKhienThuocTinh.push(inputCollection);
    }

    private _setValueForEdit() {
        const item = this.record;
        const itemThuocTinh = item.mauThuocTinhId;
        if (item.boolValue !== null) {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriBoolean.setValue(this.cities.find(e => e.label.toLowerCase() === item.boolValue.toString()));
        } else if (item.stringValue !== null) {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriString.setValue(item.stringValue);
        } else if (item.longValue !== null) {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriLong.setValue(item.longValue);
        } else if (item.doubleValue !== null) {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriDouble.setValue(item.doubleValue);
        } else {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriString.setValue(item.jsonValue);
        }
    }
}
