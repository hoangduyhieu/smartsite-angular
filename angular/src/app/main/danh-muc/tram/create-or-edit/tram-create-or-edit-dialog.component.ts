
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { MultiSelectTree, PermissionTreeEditModel } from '@shared/dft/components/permission-tree-edit.model';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';
import { CreateOrEditDanhMucTramDto, DMTramServiceProxy, FlatTreeSelectDto, LookupTableDto,
    LookupTableServiceProxy, PhanVungTram, Point } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeviewItem } from 'ngx-treeview';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-tram-create-or-edit-dialog',
    templateUrl: './tram-create-or-edit-dialog.component.html',
    styleUrls: ['./tram-create-or-edit-dialog.component.scss'],
    animations: [appModuleAnimation()],
})
export class TramCreateOrEditDialogComponent extends AppComponentBase implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    form: FormGroup;
    saving = false;
    isEdit = false;
    id: number;
    isView: boolean;
    filterPhanVung: any;
    listVung: TreeviewItem[];
    toChucItems: MultiSelectTree;
    toChucValue: number[] = [];
    input: CreateOrEditDanhMucTramDto;
    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public http: HttpClient,
        public bsModalRef: BsModalRef,
        private _dmTramAppService: DMTramServiceProxy,
        private _lookUpTable: LookupTableServiceProxy,
    ) {
        super(injector);
    }
    toChucItems1: FlatTreeSelectDto[];
    ngOnInit() {
        this.khoiTaoForm();
        this._lookUpTable.getAllPhanVungCheckBox().subscribe(data => {
            this.toChucItems1 = data;

            if (!this.id) {
                // Thêm mới
                this.input = new CreateOrEditDanhMucTramDto();
                this.isEdit = false;
                this.toChucItems = {
                    data: this.toChucItems1,
                    selectedData: [],
                };
            } else {
                this.isEdit = true;
                // Sửa
                this._dmTramAppService.getForEdit(this.id, this.isView).subscribe(item => {
                    this.input = item;
                    item.phanVungTram.forEach(e => {
                        this.toChucValue.push(e.phanVungId);
                    });
                    this._setValueForEdit();
                    if (this.isView) {
                        this.form.disable();
                    } else {
                        this.form.enable();
                    }
                    this.toChucItems = {
                        data: this.toChucItems1,
                        selectedData: item.phanVungTram.map(e => e.phanVungId),
                    };
                });
            }
        });
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            txtMaTram: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            txtTenTram: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            txtPhanVungs: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            txtDiaChi: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            txtToaDo: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            txtLoaiNguonDien: [''],
            txtGhiChu: [''],
        });
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            this._getValueForSave();
            this._dmTramAppService.createOrEdit(this.input).pipe(
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
    setControlValue(value) {
        this.toChucValue = value;
        this.form.get('txtPhanVungs').setValue(value);
    }

    private _getValueForSave() {
        this.input.phanVungTram = [];
        this.input.toaDo = undefined;
        this.toChucValue.forEach(e => {
            const pv = new PhanVungTram();
            pv.phanVungId = e;
            this.input.phanVungTram.push(pv);
        });
        this.input.ten = this.form.controls.txtTenTram.value;
        this.input.maTram = this.form.controls.txtMaTram.value;
        const td = this.form.controls.txtToaDo.value.split(', ');
        this.input.toaDoX = +td[0];
        this.input.toaDoY = +td[1];
        this.input.ghiChu = this.form.controls.txtGhiChu.value;
        this.input.diaChi = this.form.controls.txtDiaChi.value;
        this.input.loaiNguonDien = this.form.controls.txtLoaiNguonDien.value;
    }

    private _setValueForEdit() {
        this.form.controls.txtTenTram.setValue(this.input.ten);
        this.form.controls.txtMaTram.setValue(this.input.maTram);
        this.form.controls.txtDiaChi.setValue(this.input.diaChi);
        this.form.controls.txtGhiChu.setValue(this.input.ghiChu);
        this.form.controls.txtLoaiNguonDien.setValue(this.input.loaiNguonDien);
        this.form.controls.txtToaDo.setValue(this.input.toaDo.x + ', ' + this.input.toaDo.y);

    }


    close() {
        this.bsModalRef.hide();
    }

}
