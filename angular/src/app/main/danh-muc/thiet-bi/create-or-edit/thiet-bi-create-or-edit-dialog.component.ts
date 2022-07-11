
import { AppComponentBase } from '@shared/app-component-base';
import { DMThietBiServiceProxy, LoaiThietBi, LookupTableDto, LookupTableServiceProxy, ThietBiDto } from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Output, EventEmitter, Injector, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonComponent } from '@shared/dft/components/common.component';
import { finalize } from 'rxjs/operators';
import { AppLoaiThietBi } from '@shared/AppEnums';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';
import { forkJoin } from 'rxjs';
@Component({
    selector: 'app-thiet-bi-create-or-edit-dialog',
    templateUrl: './thiet-bi-create-or-edit-dialog.component.html',
    styleUrls: ['./thiet-bi-create-or-edit-dialog.component.scss']
})
export class ThietBiCreateOrEditDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter();
    form: FormGroup;
    saving = false;
    isView = false;
    id: number;
    input: ThietBiDto;
    record: ThietBiDto;
    a: any;
    arrLoaiThietBi: LookupTableDto[] = [];
    arrLuatCanhBao: LookupTableDto[] = [];
    isCamera = AppLoaiThietBi.Camera;
    tramId: number;
    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public bsModalRef: BsModalRef,
        private _lookupTableService: LookupTableServiceProxy,
        private _thietBiService: DMThietBiServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.khoiTaoForm();
        forkJoin(
            this._thietBiService.getAllLoaiThietBi(),
            this._thietBiService.getLuatCanhBao(),
        ).subscribe(([loaiThietBi, luatCanhBao]) => {
            this.arrLoaiThietBi = loaiThietBi;
            this.arrLuatCanhBao = luatCanhBao;
            if (!this.id) {
                // Thêm mới
                this.input = new ThietBiDto();
            } else {
                // Sửa
                this.input = this.record;
                this._setValueForEdit(this.record);
                if (this.record.loaiThietBi === this.isCamera) {
                    this.form.controls.DiaChiIPCamera.setValidators([Validators.required, ValidationComponent.KtraKhoangTrang]);
                } else {
                    this.form.controls.DiaChiIPCamera.setValidators([]);
                }
            }
            if (this.isView) {
                this._thietBiService.getForEdit(this.id, this.isView).subscribe(s => {
                    this.a = s;
                });
                this.form.disable();
            } else {
                this.form.enable();
            }

            if (this.record?.maThietBi.toLowerCase().includes('mcc')
            || this.record?.maThietBi.toLowerCase().includes('acm') || this.record?.maThietBi.toLowerCase().includes('ats')) {
                this.form.controls.MaThietBi.disable();
            }
        });
    }

    checkCamera() {
        this.form.controls.DiaChiIPCamera.reset();
        if (this.form.controls.LoaiThietBi.value?.id === this.isCamera) {
            this.form.controls.DiaChiIPCamera.setValidators([Validators.required, ValidationComponent.KtraKhoangTrang]);
        } else {
            this.form.controls.DiaChiIPCamera.setValidators([]);
        }
        this.form.controls.DiaChiIPCamera.reset();
    }
    khoiTaoForm() {
        this.form = this._fb.group({
            MaThietBi: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            TenThietBi: ['', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }],
            LoaiThietBi: ['', Validators.required],
            XacThucThietBi: [0, Validators.required],
            LuatCanhBao: [''],
            IdThietBi: [''],
            AccessToken: [''],
            DiaChiIPCamera: [''],
            PortCamera: [''],
            GhiChu: [''],
        });
    }
    resetForm() {
    }
    save() {
        if (CommonComponent.getControlErr(this.form) === '') {
            this._getValueForSave();
            this.saving = true;
            this._thietBiService.createOrEdit(this.input).pipe(
                finalize(() => {
                    this.saving = false;
                })
            ).subscribe((result) => {
                switch (result) {
                    // Thành công
                    case 0:
                        if (!this.id) {
                            this.showCreateMessage();
                            this.bsModalRef.hide();
                            this.onSave.emit();
                        } else {
                            this.showUpdateMessage();
                            this.bsModalRef.hide();
                            this.onSave.emit();
                        }
                        break;
                    // Mã phân vùng đã tồn tại
                    case 1:
                        this.showExistMessage('Mã thiết bị đã tồn tại', 'warning');
                        break;
                    case 2:
                        this.showExistMessage('Tên thiết bị đã tồn tại', 'warning');
                        break;
                    case 3:
                        this.showExistMessage('Mã và Tên thiết bị đã tồn tại', 'warning');
                        break;
                    default:
                        break;
                }
            });
        }
    }

    close() {
        this.bsModalRef.hide();
    }

    private _setValueForEdit(record?: ThietBiDto) {
        this.form.controls.MaThietBi.setValue(record.maThietBi);
        this.form.controls.TenThietBi.setValue(record.ten);
        this.form.controls.LoaiThietBi.setValue(this.arrLoaiThietBi.find(e => e.id === record.loaiThietBi));
        this.form.controls.LuatCanhBao.setValue(this.arrLuatCanhBao.find(e => e.id === record.boCanhBaoId));
        this.form.controls.GhiChu.setValue(record.ghiChu);
        // Tu ThingsBoard
        this.form.controls.IdThietBi.setValue(record.tbEntityId);
        this.form.controls.XacThucThietBi.setValue(record.xacThucThietBi);
        this.form.controls.AccessToken.setValue(record.accessToken);
        // Camera
        this.form.controls.DiaChiIPCamera.setValue(record.loaiThietBi === this.isCamera ? record.cameraLink : undefined);
    }

    private _getValueForSave() {
        this.input.id = this.id ? this.record.id : undefined;
        this.input.maThietBi = this.form.controls.MaThietBi.value;
        this.input.ten = this.form.controls.TenThietBi.value;
        this.input.loaiThietBi = this.form.controls.LoaiThietBi.value?.id;
        this.input.boCanhBaoId = this.form.controls.LuatCanhBao.value?.id;
        this.input.ghiChu = this.form.controls.GhiChu.value;
        this.input.tramId = this.id ? this.record.tramId : this.tramId;
        this.input.xacThucThietBi = this.id ? this.form.controls.XacThucThietBi.value : 0;
        this.input.cameraLink = this.form.controls.DiaChiIPCamera.value;
    }
}
