import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CommonComponent } from '../../../../../shared/dft/components/common.component';
import {
    BoCanhBao,
    BoCanhBaoCreateInput, CanhBao, CanhBaoCreateInput, DMBoCanhBaoServiceProxy, DMCanhBaoServiceProxy,
    DMNguoiNhanCanhBaoServiceProxy,
    NguoiNhanCanhBaoCreateInput, NhanVienRaVaoTramDto
} from '../../../../../shared/service-proxies/service-proxies';
import { IDeviceProfile } from '../../../../../shared/interfaces/IServerity';
import { LazyLoadEvent } from 'primeng/api';
import { CanhBaoCreateOrEditComponent } from '../canh-bao-create-or-edit/canh-bao-create-or-edit.component';
import { ValidationComponent } from '../../../../../shared/dft/components/validation-messages.component';

@Component({
    selector: 'app-bo-canh-bao-create-or-edit-dialog',
    templateUrl: './bo-canh-bao-create-or-edit-dialog.component.html',
    styleUrls: ['./bo-canh-bao-create-or-edit-dialog.component.scss'],
})
export class BoCanhBaoCreateOrEditDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();
    form: FormGroup;
    saving = false;
    isEdit = false;
    boCanhBaoDto: BoCanhBao = new BoCanhBao();
    boCanhBaoCreateInput: BoCanhBaoCreateInput = new BoCanhBaoCreateInput();
    id: number;
    isView: boolean;
    arlamSelected: CanhBao[] = [];
    arlamIds: number[] = [];
    arlamNames: string[] = [];
    value: any;
    arrValue: any[] = [];
    backupValue: any = [];
    totalCount = 0;
    thongBao = this.l('qlluatcanhbao_tentruonghopcanhbaodatontai');


    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public http: HttpClient,
        public bsModalRef: BsModalRef,
        private _modalService: BsModalService,
        private _boCanhBaoService: DMBoCanhBaoServiceProxy,
        private _canhBaoService: DMCanhBaoServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.khoiTaoForm();
        if (!this.id) {
            // Thêm mới
            this.boCanhBaoDto = new BoCanhBao();
            this.isEdit = false;
        } else {
            this.getDataPage();
        }
        if (this.isView) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            nameArlam: ['', [Validators.required, ValidationComponent.KtraKhoangTrang]],
            description: ['']
        });
    }

    getDataPage() {
        this.isEdit = true;
        this._boCanhBaoService.getForEdit(this.id, this.isView).subscribe(item => {
            this.boCanhBaoDto = item;
            this.totalCount = item.canhBao.length;
            for (const boCanhBao of this.boCanhBaoDto.canhBao) {
                boCanhBao.tbCreateRules = JSON.parse(boCanhBao.tbCreateRules);
            }
            this._setValueForEdit();
        });
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') { // kiểm tra xem form có lỗi k
            this.boCanhBaoCreateInput = new BoCanhBaoCreateInput();
            this._getValueForSave();
            this.boCanhBaoCreateInput.canhBao = new Array<CanhBao>();
            this.boCanhBaoDto.canhBao.forEach(element => {
                const canhBao = new CanhBao();
                element.id === -1 ? canhBao.id = undefined : canhBao.id = element.id;
                canhBao.boCanhBao = element.boCanhBao;
                canhBao.boCanhBaoId = element.boCanhBaoId;
                canhBao.creationTime = element.creationTime;
                canhBao.tbAlarmType = element.tbAlarmType;
                canhBao.ghiChu = element.ghiChu;
                element.tbId !== undefined ? canhBao.tbId = element.tbId : canhBao.tbId = '1';
                canhBao.tbClearRule = JSON.parse(JSON.stringify(element.tbClearRule));
                canhBao.tbCreateRules = canhBao.tbCreateRules = JSON.stringify(element.tbCreateRules);
                this.boCanhBaoCreateInput.canhBao.push(canhBao);
            });
            this._boCanhBaoService.createOrEdit(this.boCanhBaoCreateInput).pipe(
                finalize(() => {
                    this.saving = false;
                })
            ).subscribe((result) => {
                if (result === 3) {
                    this.showExistMessage(this.l('qlluatcanhbao_tendatontai'));
                } else if (!this.id) {
                    this.showCreateMessage();
                    this.bsModalRef.hide();
                } else {
                    this.showUpdateMessage();
                    this.bsModalRef.hide();
                }
                this.onSave.emit();
            });
        }
    }

    canhBaoCreateOrEdit(value, result) {
        this._canhBaoService.createOrEdit(value).pipe(
            finalize(() => {
                this.saving = false;
            })
        ).subscribe((result2) => {
            if (result2 === 1) {
                this.showExistMessage(this.thongBao);
                this._boCanhBaoService.delete(result);
                this._canhBaoService.deleteByIdBoCanhBao(result2);
            }
        });
    }

    checkTrung() {
        const arr = [];
        for (const value of this.arrValue) {
            arr.push(value.tbAlarmType);
        }
        for (const item of arr) {
            if (arr.indexOf(item) !== arr.lastIndexOf(item)) {
                return true;
            }
        }
        return false;
    }


    getLength(object): number {
        return Object.keys(object).length;
    }

    close() {
        this.bsModalRef.hide();
    }

    private _setValueForEdit() {
        this.form.controls.nameArlam.setValue(this.boCanhBaoDto.ten);
        this.form.controls.description.setValue(this.boCanhBaoDto.ghiChu);
    }

    private _getValueForSave() {
        this.boCanhBaoCreateInput.id = this.id;
        this.boCanhBaoCreateInput.ten = this.form.controls.nameArlam.value.replace(/\s+/g, ' ').trim();
        this.boCanhBaoCreateInput.ghiChu = this.form.controls.description.value.replace(/\s+/g, ' ').trim();
        this.boCanhBaoCreateInput.tbId = this.boCanhBaoDto.tbId;
    }

    showCreateOrEditAlarm(id?: number, isView = false, idDevice?: number, record?: any): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            CanhBaoCreateOrEditComponent,
            {
                class: 'modal-xl',
                ignoreBackdropClick: true,
                initialState: {
                    id,
                    isView,
                    idDevice,
                    record,
                    listCanhBao: this.boCanhBaoDto.canhBao,
                },
            }
        );

        // ouput emit
        createOrEditUserDialog.content.onSave.subscribe((value) => {
            if (value) {
                this.value = value.canhBao;
                if (value.tenCu !== undefined && this.boCanhBaoDto.canhBao !== undefined) {
                    const dataCu = this.boCanhBaoDto.canhBao.find(w => w.tbAlarmType === value.tenCu);
                    const index = this.boCanhBaoDto.canhBao.indexOf(dataCu);
                    this.boCanhBaoDto.canhBao[index] = this.value;
                } else if (this.boCanhBaoDto.canhBao !== undefined) {
                    this.boCanhBaoDto.canhBao.push(this.value);
                } else {
                    this.boCanhBaoDto.canhBao = new Array<CanhBao>();
                    this.boCanhBaoDto.canhBao.push(this.value);
                }
            } else {
                this.getDataPage();
            }

        });
    }

    deleteArlam() {
        this.arlamIds = [];
        this.arlamSelected.forEach(e => {
            this.arlamIds.push(e.id);
            this.arlamNames.push(e.tbAlarmType);
        });
        const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
        '<p class="text-popup-xoa m-t-8">'
         +  this.l('qlluatcanhbao_canhbao') + this.arlamNames.join(', ') + this.l('isdeleted') + '</p>';
        this.swal.fire({
            html: html1,
            icon: 'warning',
            iconHtml: '<span class="icon1">&#9888</span>',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: this.confirmButtonColor,
            cancelButtonColor: this.cancelButtonColor,
            cancelButtonText: this.l(this.cancelButtonText),
            confirmButtonText: this.l(this.deleteButtonText)
        }).then((result) => {
            if (result.value) {
                this.arlamSelected.forEach(e => {
                    this.boCanhBaoDto.canhBao.splice(this.boCanhBaoDto.canhBao.indexOf(e), 1);
                });
                this.arlamSelected = [];
                this.arlamIds = [];
                this.arlamNames = [];
                this.showDeleteMessage();
            } else {
                this.arlamSelected = [];
                this.arlamIds = [];
                this.arlamNames = [];
            }
        });
    }

    checkSaving() {
        if (this.boCanhBaoDto.canhBao != null) {
            if (this.boCanhBaoDto.canhBao.length === 0) {
                return true;
            } else {
                return this.isView;
            }
        } else {
            return true;
        }
    }

    checkDelete() {
        if (this.arlamSelected.length === 0) {
            return true;
        } else {
            return this.isView;
        }
    }
}
