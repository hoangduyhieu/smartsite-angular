
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';
import {
    DMPhanVungServiceProxy,
    LookupTableServiceProxy, PhanVungCreateInputDto, PhanVungNguoiDungDto, PhanVungNhanCanhBao, PhanVungPhuTrach, User
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeviewItem } from 'ngx-treeview';
import { SelectItem } from 'primeng';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-phan-vung-create-or-edit-dialog',
    templateUrl: './phan-vung-create-or-edit-dialog.component.html',
    styleUrls: ['./phan-vung-create-or-edit-dialog.component.scss'],
})
export class PhanVungCreateOrEditDialogComponent extends AppComponentBase implements OnInit {
    danhSachNguoiDung: PhanVungNguoiDungDto[];
    danhSachNguoiPhuTrach = [];
    @Output() onSave = new EventEmitter<any>();
    saving = false;
    isEdit = false;
    isView = false;
    phanVungDto: PhanVungCreateInputDto;
    id: number;
    phanVungItems: TreeviewItem[];
    phanVungValue: number;
    contactList: FormArray;
    form: FormGroup;
    optionNguoiNhan: SelectItem[] = [];
    danhSachNguoiPhuTrachView: any[];
    arrLuat: any;
    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        private _lookupTableService: LookupTableServiceProxy,
        public bsModalRef: BsModalRef,
        private _dmPhanVungAppService: DMPhanVungServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.khoiTaoForm();
        forkJoin(
            this._dmPhanVungAppService.
                getNguoiDung(null),
            this._dmPhanVungAppService.
                getLuatCanhBao(),
            this._dmPhanVungAppService.
                getNguoiNhanCanhBao(),
            this._lookupTableService.
                getAllPhanVungTree(undefined),
        ).subscribe(([nguoiDung, luatCanhBao, nguoiNhanCanhBao, phanVung]) => {
            this.danhSachNguoiDung = nguoiDung;
            this.arrLuat = luatCanhBao;
            nguoiNhanCanhBao.forEach(e => {
                this.optionNguoiNhan.push
                    ({
                        value: e.id, label: e.displayName, disabled: e.disabled,
                        title: undefined,
                    });
            });
            this.phanVungItems = this.getTreeviewItem(phanVung);
        });
        if (!this.id) {
            // Thêm mới
            this.phanVungDto = new PhanVungCreateInputDto();
            this.isEdit = false;
        } else {
            this.isEdit = true;
            // Sửa
            this._dmPhanVungAppService.getForEdit(this.id, this.isView).subscribe(item => {
                this.phanVungDto = item;
                this._lookupTableService.getAllPhanVungTree(item?.id).subscribe((phanVung) => {
                    this.phanVungItems = this.getTreeviewItem(phanVung);
                    this._setValueForEdit();
                });
            });

        }
        if (this.isView) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    checkDisable() {
        this.form.controls.projects.value.forEach((element: { NguoiNhan: any; }) => {
            if (this.optionNguoiNhan.find(e => e.value === element.NguoiNhan) !== undefined) {
                this.optionNguoiNhan.find(e => e.value === element.NguoiNhan).disabled = true;
            }
        });
    }

    resetOptions() {
        this.optionNguoiNhan.forEach(item => {
            item.disabled = false;
        });

        this.checkDisable();
    }

    setControlValue(value: number) {
        this.phanVungValue = value;
        this.form.get('PhanVungCha').setValue(value);
    }

    khoiTaoForm() {
        this.form = new FormGroup({
            MaPhanVung: new FormControl('', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }),
            TenPhanVung: new FormControl('', { validators: [Validators.required, ValidationComponent.KtraKhoangTrang] }),
            PhanVungCha: new FormControl(''),
            GhiChu: new FormControl(''),
            projects: this._fb.array([this.createNguoiNhanCanhBao()]),
        });

        this.contactList = this.form.get('projects') as FormArray;
        while (this.contactList.length !== 0) {
            this.contactList.removeAt(0);
        }
    }
    get nguoiNhanFormGroup() {
        return this.form.get('projects') as FormArray;
    }

    createNguoiNhanCanhBao(nguoiNhan: number = null, luat: any[] = []): FormGroup {
        return this._fb.group({
            NguoiNhan: [nguoiNhan, Validators.compose([Validators.required])],
            Luat: [luat, Validators.compose([Validators.required])],
        });
    }

    addNguoiNhanCanhBao() {
        this.contactList.push(this.createNguoiNhanCanhBao());
    }

    removeNguoiNhanCanhBao(index: number) {
        if (this.optionNguoiNhan.find(e => e.value === this.contactList.value[index].NguoiNhan) !== undefined) {
            this.optionNguoiNhan.find(e => e.value === this.contactList.value[index].NguoiNhan).disabled = false;
        }
        this.contactList.removeAt(index);
    }

    save(): void {
        this._getValueForSave();
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            if (!this.id) {
                this._dmPhanVungAppService.create(this.phanVungDto)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((result) => {
                        switch (result) {
                            // Thành công
                            case 1:
                                this.showCreateMessage();
                                this.bsModalRef.hide();
                                this.onSave.emit();
                                break;
                            // Mã phân vùng đã tồn tại
                            case 2:
                                this.showExistMessage(this.l('qlphanvung_maphanvungdatontai'), 'warning');
                                break;
                            case 3:
                                this.showExistMessage('qlphanvung_tenphanvungdatontai', 'warning');
                                break;
                            case 4:
                                this.showExistMessage('qlphanvung_mavatendatontai', 'warning');
                                break;
                            case 5:
                                this.showExistMessage('qlphanvung_themmoikhongthanhcong', 'warning');
                                break;
                            default:
                                break;
                        }
                    });
            } else {
                this._dmPhanVungAppService.update(this.phanVungDto)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((result) => {
                        switch (result) {
                            // Thành công
                            case 1:
                                this.showUpdateMessage();
                                this.bsModalRef.hide();
                                this.onSave.emit();
                                break;
                            // Mã phân vùng đã tồn tại
                            case 2:
                                this.showExistMessage(this.l('qlphanvung_maphanvungdatontai'), 'warning');
                                break;
                            case 3:
                                this.showExistMessage(this.l('qlphanvung_tenphanvungdatontai'), 'warning');
                                break;
                            case 4:
                                this.showExistMessage(this.l('qlphanvung_mavatendatontai'), 'warning');
                                break;
                            case 5:
                                this.showExistMessage(this.l('qlphanvung_capnhatkhongthanhcong'), 'warning');
                                break;
                            default:
                                break;
                        }
                    });
            }
        }
    }

    close() {
        this.bsModalRef.hide();
    }

    private _setValueForEdit() {
        this.form.controls.MaPhanVung.setValue(this.phanVungDto.maPhanVung);
        this.form.controls.TenPhanVung.setValue(this.phanVungDto.ten);
        this.phanVungValue = this.phanVungDto.phanVungChaId;
        this.form.controls.PhanVungCha.setValue(this.phanVungDto.phanVungChaId);
        this.form.controls.GhiChu.setValue(this.phanVungDto.ghiChu);
        // Hiển thị danh sách người Phụ Trách xem chi tiết
        const arrUsers = new Array<User>();
        for (const nguoiPhuTrach of this.phanVungDto.phanVungPhuTrach) {
            const user = new User();
            user.id = nguoiPhuTrach.user.id;
            user.userName = nguoiPhuTrach.user.userName;
            user.name = nguoiPhuTrach.user.name;
            user.emailAddress = nguoiPhuTrach.user.emailAddress;
            user.phoneNumber = nguoiPhuTrach.user.phoneNumber;
            arrUsers.push(user);
        }
        this.danhSachNguoiPhuTrachView = arrUsers;
        // Hiển thị danh sách người Phụ Trách và người dùng khi cập nhật
        const arrNguoiPhuTrach = new Array<PhanVungNguoiDungDto>();
        const arrIdNguoiPhuTrach = new Array<number>();
        for (const i of this.phanVungDto.phanVungPhuTrach) {
            const nguoiPhuTrach = new PhanVungNguoiDungDto();
            nguoiPhuTrach.id = i.user.id;
            nguoiPhuTrach.name = i.user.name;
            nguoiPhuTrach.userName = i.user.userName;
            arrNguoiPhuTrach.push(nguoiPhuTrach);
            arrIdNguoiPhuTrach.push(i.user.id);
        }
        this.danhSachNguoiPhuTrach = arrNguoiPhuTrach;
        this._dmPhanVungAppService.getNguoiDung(arrIdNguoiPhuTrach).subscribe(item => {
            this.danhSachNguoiDung = item;
        });
        // Hiển thị danh sách người nhận cảnh báo khi cập nhật và xem chi tiết
        for (const i of this.phanVungDto.pvNhanCanhBao) {
            this.contactList.push(this.createNguoiNhanCanhBao
                (this.optionNguoiNhan.find(w => w.value === i.nguoiNhanCanhBao)?.value,
                    this.arrLuat?.filter((w: { id: any; }) => _.includes(i.luatCanhBao, w.id))));
            const check = this.optionNguoiNhan.find(e => e.value === i.nguoiNhanCanhBao);
            if (check !== undefined) {
                this.optionNguoiNhan.find(e => e.value === i.nguoiNhanCanhBao).disabled = true;
            }
        }
    }

    private _getValueForSave() {
        this.phanVungDto.maPhanVung = this.form.get('MaPhanVung').value;
        this.phanVungDto.ten = this.form.get('TenPhanVung').value;
        this.phanVungDto.phanVungChaId = this.form.get('PhanVungCha').value;
        this.phanVungDto.ghiChu = this.form.get('GhiChu').value;
        // Get danh sách người phụ trách để lưu
        const arrNguoiPhuTrach = new Array<PhanVungPhuTrach>();
        for (const i of this.danhSachNguoiPhuTrach) {
            const nguoiPhuTrach = new PhanVungPhuTrach();
            nguoiPhuTrach.userId = i?.id;
            arrNguoiPhuTrach.push(nguoiPhuTrach);
        }
        this.phanVungDto.phanVungPhuTrach = arrNguoiPhuTrach;
        // Get danh sách người nhận cảnh báo để lưu
        const arrNguoiNhanCanhBao = new Array<PhanVungNhanCanhBao>();
        for (const i of this.contactList.value) {
            for (const ii of i.Luat) {
                const nguoiNhanCanhBao = new PhanVungNhanCanhBao();
                nguoiNhanCanhBao.nguoiNhanCanhBaoId = i.NguoiNhan;
                nguoiNhanCanhBao.boCanhBaoId = ii.id;
                arrNguoiNhanCanhBao.push(nguoiNhanCanhBao);
            }
        }
        this.phanVungDto.phanVungNhanCanhBao = arrNguoiNhanCanhBao;
    }
}
