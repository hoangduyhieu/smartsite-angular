
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';
import { FileDownloadService } from '@shared/file-download.service';
import { CreateOrEditMauThuocTinhDto, DMMauThuocTinhServiceProxy, LookupTableDto, LookupTableServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-mau-thuoc-tinh-create-or-edit-dialog',
    templateUrl: './mau-thuoc-tinh-create-or-edit-dialog.component.html',
    styleUrls: ['./mau-thuoc-tinh-create-or-edit-dialog.component.scss']
})
export class MauThuocTinhCreateOrEditDialogComponent extends AppComponentBase implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    form: FormGroup;
    saving = false;
    isEdit = false;
    id: number;
    isView: boolean;

    arrKieuDuLieu: LookupTableDto[] = [];
    demoDto: CreateOrEditMauThuocTinhDto = new CreateOrEditMauThuocTinhDto();

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public http: HttpClient,
        private _fileDownloadService: FileDownloadService,
        private _lookupTableService: LookupTableServiceProxy,
        private _mauThuocTinhService: DMMauThuocTinhServiceProxy,
        public bsModalRef: BsModalRef,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.khoiTaoForm();
        this._lookupTableService.getAllKieuDuLieu().subscribe(rs => {
            this.arrKieuDuLieu = rs;
        });

        if (!this.id) {
            // Thêm mới
            this.demoDto = new CreateOrEditMauThuocTinhDto();
            this.isEdit = false;
        } else {
            this.isEdit = true;
            // Sửa
            this._mauThuocTinhService.getForEdit(this.id, this.isView).subscribe(item => {
                this.demoDto = item;
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
            txtTen: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            txtTenHienThi: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            txtComBoBox: ['', Validators.required],
            txtGhiChu: [''],
        });
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            this._getValueForSave();
            this._mauThuocTinhService.createOrEdit(this.demoDto).pipe(
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

    private _setValueForEdit() {
        this.form.controls.txtTen.setValue(this.demoDto.ten);
        this.form.controls.txtTenHienThi.setValue(this.demoDto.tenHienThi);
        this.form.controls.txtComBoBox.setValue(this.arrKieuDuLieu.find(e => e.id === this.demoDto.kieuDuLieu));
        this.form.controls.txtGhiChu.setValue(this.demoDto.ghiChu);
    }

    private _getValueForSave() {
        this.demoDto.tenHienThi = this.form.controls.txtTenHienThi.value;
        this.demoDto.ten = this.form.controls.txtTen.value;
        this.demoDto.kieuDuLieu = this.form.controls.txtComBoBox.value?.id;
        this.demoDto.ghiChu = this.form.controls.txtGhiChu.value;
    }

    close() {
        this.bsModalRef.hide();
    }
}
