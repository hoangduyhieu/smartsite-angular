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
    DMTramServiceProxy, KieuDuLieuLookupTable, MauDieuKhienThuocTinh, MauThuocTinh, ThuocTinhDieuKhienTram, TramDieuKhienThuocTinh, TramDto
} from '@shared/service-proxies/service-proxies';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SelectItem } from 'primeng';
import { finalize } from 'rxjs/operators';
@Component({
    selector: 'app-mau-dieu-khien-tram',
    templateUrl: './create-or-edit-nhieu-tram-dieu-khien.component.html',
    animations: [appModuleAnimation()],
})
export class CreateOrEditNhieuMauDieuKhienTramComponent extends AppComponentBase implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    input: ThuocTinhDieuKhienTram = new ThuocTinhDieuKhienTram();
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
    listMTT: MauThuocTinh[];
    listId: number[];
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
        this._dmTramAppService.getListMauThuocTinh().subscribe(rs => {
            this.listMTT = rs;
        });
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
            this.input = new ThuocTinhDieuKhienTram();
            if (!this.record) {
                // Thêm mới
                this.isEdit = false;
            } else {
                this.isEdit = true;
                // Sửa
                this._setValueForEdit();
                this.form.enable();
            }
        });
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            txtThuocTinh: [undefined, Validators.required],
            txtGiaTriLong: [],
            txtGiaTriDouble: [],
            txtGiaTriBoolean: [],
            // txtGiaTriString: ['', { validators: [ValidationComponent.KtraKhoangTrang] }],
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
        const optionArray = this.listMTT.find(e => e.id === this.form.controls.txtThuocTinh.value);
        if (optionArray.kieuDuLieu === 1) {
            this.form.controls.txtGiaTriBoolean.setValidators([
                Validators.required,
            ]);
            this.form.controls.txtGiaTriDouble.setValidators([]);
            this.form.controls.txtGiaTriLong.setValidators([]);
            this.form.controls.txtGiaTriString.setValidators([]);
        }

        if (optionArray.kieuDuLieu === 2 || optionArray.kieuDuLieu === 5) {
            this.form.controls.txtGiaTriString.setValidators([
                Validators.required, ValidationComponent.KtraKhoangTrang
            ]);
            this.form.controls.txtGiaTriDouble.setValidators([]);
            this.form.controls.txtGiaTriLong.setValidators([]);
            this.form.controls.txtGiaTriBoolean.setValidators([]);
        }

        if (optionArray.kieuDuLieu === 3) {
            this.form.controls.txtGiaTriLong.setValidators([
                Validators.required,
            ]);
            this.form.controls.txtGiaTriDouble.setValidators([]);
            this.form.controls.txtGiaTriString.setValidators([]);
            this.form.controls.txtGiaTriBoolean.setValidators([]);
        }

        if (optionArray.kieuDuLieu === 4) {
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
                const check = this.listId.includes(this.input.mauThuocTinhId);
                if (check) {
                    this.showWarningPopUpMessage(this.l('cht_thuoctinhdatontai'));
                    this.saving = false;
                } else {
                    this.onSave.emit(this.input);
                    this.showCreateMessage();
                    this.bsModalRef.hide();
                }
            } else {
                const check1 = this.listId.filter((_e, i) => i !== this.idRecord).includes(this.input.mauThuocTinhId);
                if (check1) {
                    this.showWarningPopUpMessage(this.l('cht_thuoctinhdatontai'));
                    this.saving = false;
                } else {
                    this.onSave.emit(this.input);
                    this.showUpdateMessage();
                    this.bsModalRef.hide();
                }
            }
        }
    }

    private _getValueForSave() {
        const optionArray = this.listMTT.find(e => e.id === this.form.controls.txtThuocTinh.value);
        this.input.mauThuocTinhId = optionArray.id;
        this.input.mauThuocTinh = optionArray;
        this.input.tramId = this.tramId;
        if (optionArray.kieuDuLieu === 1) {
            this.input.boolValue = this.form.controls.txtGiaTriBoolean.value?.label;
        } else if (optionArray.kieuDuLieu === 2) {
            this.input.stringValue = this.form.controls.txtGiaTriString.value;
        } else if (optionArray.kieuDuLieu === 3) {
            this.input.longValue = this.form.controls.txtGiaTriLong.value;
        } else if (optionArray.kieuDuLieu === 4) {
            this.input.doubleValue = this.form.controls.txtGiaTriDouble.value;
        } else {
            this.input.jsonValue = this.form.controls.txtGiaTriString.value;
        }
    }

    private _setValueForEdit() {
        const item = this.record;
        const itemThuocTinh = item.mauThuocTinhId;

        if (item.boolValue !== undefined) {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriBoolean.setValue(this.cities.find(e => e.label === item.boolValue.toString()));
        } else if (item.stringValue !== undefined) {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriString.setValue(item.stringValue);
        } else if (item.longValue !== undefined) {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriLong.setValue(item.longValue);
        } else if (item.doubleValue !== undefined) {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriDouble.setValue(item.doubleValue);
        } else {
            this.form.controls.txtThuocTinh.setValue(this.optionKieuDuLieu.find(e => e.value === itemThuocTinh)?.value);
            this.form.controls.txtGiaTriString.setValue(item.jsonValue);
        }
    }
}
