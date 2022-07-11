import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injector, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';
import { FileDownloadService } from '@shared/file-download.service';
import {
    CreateOrEditDanhMucTramDto,
    DanhSachTramView,
    DMMauCanhBaoServiceProxy,
    DMMauDieuKhienServiceProxy,
    DMMauThuocTinhServiceProxy,
    DMTramServiceProxy, LookupTableDto, ThuocTinhCanhBaoTram, ThuocTinhDieuKhienTram, TramCanhBaoThuocTinh, TramDieuKhienThuocTinh,
} from '@shared/service-proxies/service-proxies';
import { indexOf } from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, SelectItem, Table } from 'primeng';
import { Accordion } from 'primeng/accordion';
import { finalize } from 'rxjs/operators';
import { CreateOrEditMauCanhBaoTramComponent } from '../create-or-edit-mau-canh-bao-tram/create-or-edit-mau-canh-bao-tram.component';
import {
    CreateOrEditNhieuMauCanhBaoTramComponent
} from './create-or-edit-nhieu-tram-canh-bao/create-or-edit-nhieu-tram-canh-bao.component';
import { CreateOrEditNhieuMauDieuKhienTramComponent } from './create-or-edit-nhieu-tram-dieu-khien/create-or-edit-nhieu-tram-dieu-khien.component';
@Component({
    selector: 'app-mau-dieu-khien-tram',
    templateUrl: './cau-hinh-nhieu-tram.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./cau-hinh-nhieu-tram.component.scss'],
})
export class ConfigNhieuTramComponent extends AppComponentBase implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    @ViewChild('groupTab', { static: true }) groupTab: Accordion;
    @ViewChild('dt') table: Table;
    @ViewChild('dt1') table1: Table;
    @Input() tramId: number;
    danhSachView: DanhSachTramView[];
    form: FormGroup;
    valueDieuKhien: ThuocTinhDieuKhienTram[] = [];
    valueDieuKhienFake: any[];
    valueCanhBao: ThuocTinhCanhBaoTram[] = [];
    valueCanhBaoFake: any[];
    saving = false;
    arrKieuDuLieuString = ['', 'Boolean', 'String', 'Long', 'Double', 'Json'];
    display: string;
    inputData: CreateOrEditDanhMucTramDto[] = [];
    input1: number;
    input2: number;
    loading = true;
    loading2 = true;
    collapsedAll = false;
    totalCount1 = 0;
    totalCount2 = 0;
    exporting = false;
    arrKieuDuLieuMCB: LookupTableDto[];
    arrKieuDuLieuMDK: LookupTableDto[];
    thuocTinh: any;
    selectedListCanhBao: ThuocTinhCanhBaoTram[] = [];
    selectedListDieuKhien: ThuocTinhDieuKhienTram[] = [];
    listTramId: number[] = [];
    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public http: HttpClient,
        public bsModalRef: BsModalRef,
        private _modalService: BsModalService,
        private _mauThuocTinhService: DMMauThuocTinhServiceProxy,
        private _mauCanhBaoService: DMMauCanhBaoServiceProxy,
        private _mauDieuKhienService: DMMauDieuKhienServiceProxy,
        private _dmTramAppService: DMTramServiceProxy,
    ) { super(injector); }

    ngOnInit(): void {
        this.khoiTaoForm();
        this.collapsedAll = false;
        this.setCollapseAll(this.collapsedAll, [0]);
        this._mauCanhBaoService.getAllLookupTableMauCanhBao().subscribe(rs => {
            this.arrKieuDuLieuMCB = rs;
        });

        this._mauDieuKhienService.getAllLookupTableMauDieuKhien().subscribe(rs => {
            this.arrKieuDuLieuMDK = rs;
        });
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            txtMauDieuKhien: [],
            txtMauCanhBao: [],
        });
    }

    setCollapseAll(isCollapsed = false, excludeIdList?: number[]): void {
        for (let i = 0; i < this.groupTab.tabs.length; i++) {
            if (!excludeIdList || excludeIdList.indexOf(i) < 0) {
                this.groupTab.tabs[i].selected = isCollapsed;
            } else {
                this.groupTab.tabs[i].selected = !isCollapsed;
            }
        }

        this.collapsedAll = !isCollapsed;
    }

    close() {
        this.bsModalRef.hide();
    }

    createMCBT(record?: TramCanhBaoThuocTinh, idRecord?: number) {
        const sorted = this.getSortField(this.table1);
        const listId = this.valueCanhBao.map(e => e.mauThuocTinhId);
        this._showCreateOrEditMCBTDialog(this.tramId, record, idRecord, sorted, listId);
    }

    createMDKT(record?: TramDieuKhienThuocTinh, idRecord?: number) {
        const sorted = this.getSortField(this.table1);
        const listId = this.valueDieuKhien.map(e => e.mauThuocTinhId);
        this._showCreateOrEditMDKTDialog(this.tramId, record, idRecord, sorted, listId);
    }

    deleteMCBT(record: ThuocTinhCanhBaoTram) {
        // tslint:disable-next-line:tsr-detect-possible-timing-attacks
        this.valueCanhBao = this.valueCanhBao.filter(re => re.mauThuocTinhId !== record.mauThuocTinhId);
        this.selectedListCanhBao = [];
        this.showDeleteMessage();
    }

    deleteMDKT(record: ThuocTinhDieuKhienTram) {
        // tslint:disable-next-line:tsr-detect-possible-timing-attacks
        this.valueDieuKhien = this.valueDieuKhien.filter(re => re.mauThuocTinhId !== record.mauThuocTinhId);
        this.selectedListDieuKhien = [];
        this.showDeleteMessage();
    }

    deleteGroupMCBT() {
        const listId = this.selectedListCanhBao.map(e => e.mauThuocTinhId);
        this.valueCanhBao = this.valueCanhBao.filter(re => !listId.includes(re.mauThuocTinhId));
        this.selectedListCanhBao = [];
        this.showDeleteMessage();
    }

    deleteGroupMDKT() {
        const listId = this.selectedListDieuKhien.map(e => e.mauThuocTinhId);
        this.valueDieuKhien = this.valueDieuKhien.filter(re => !listId.includes(re.mauThuocTinhId));
        this.selectedListDieuKhien = [];
        this.showDeleteMessage();
    }

    private _showCreateOrEditMCBTDialog(tramId?: number, record?: TramCanhBaoThuocTinh,
        idRecord?: number, sorted?: string, listId?: number[]): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            CreateOrEditNhieuMauCanhBaoTramComponent,
            {
                class: 'modal-xl',
                ignoreBackdropClick: true,
                initialState: {
                    tramId,
                    record,
                    idRecord,
                    sorted,
                    listId,
                },
            }
        );

        createOrEditUserDialog.content.onSave.subscribe((rs) => {
            this.privateLuuTamDanhSachCanhBaoTram(rs, idRecord);
        });
    }

    private _showCreateOrEditMDKTDialog(tramId?: number, record?: TramDieuKhienThuocTinh,
        idRecord?: number, sorted?: string, listId?: number[]): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            CreateOrEditNhieuMauDieuKhienTramComponent,
            {
                class: 'modal-xl',
                ignoreBackdropClick: true,
                initialState: {
                    tramId,
                    record,
                    idRecord,
                    sorted,
                    listId,
                },
            }
        );

        createOrEditUserDialog.content.onSave.subscribe((rs) => {
            this.privateLuuTamDanhSachDieuKhienTram(rs, idRecord);
        });
    }

    privateLuuTamDanhSachCanhBaoTram(record?: ThuocTinhCanhBaoTram, indexRecord?: number) {
        if (indexRecord === undefined) {
            const thuocTinh = new ThuocTinhCanhBaoTram();
            thuocTinh.boolValue = record.boolValue;
            thuocTinh.stringValue = record.stringValue;
            thuocTinh.doubleValue = record.doubleValue;
            thuocTinh.jsonValue = record.jsonValue;
            thuocTinh.longValue = record.longValue;
            thuocTinh.mauThuocTinh = record.mauThuocTinh;
            thuocTinh.mauThuocTinhId = record.mauThuocTinhId;
            this.valueCanhBao.push(thuocTinh);
            this.totalCount2 = this.valueCanhBao.length;
        } else {
            const a = new Array<ThuocTinhCanhBaoTram>();
            this.valueCanhBao.forEach((e, index) => {
                if (index === indexRecord) {
                    a.push(record);
                } else {
                    a.push(e);
                }
            });
            this.valueCanhBao = a;
            this.totalCount2 = this.valueCanhBao.length;
        }
    }

    privateLuuTamDanhSachDieuKhienTram(record?: ThuocTinhDieuKhienTram, indexRecord?: number) {
        if (indexRecord === undefined) {
            const thuocTinh = new ThuocTinhDieuKhienTram();
            thuocTinh.boolValue = record.boolValue;
            thuocTinh.stringValue = record.stringValue;
            thuocTinh.doubleValue = record.doubleValue;
            thuocTinh.jsonValue = record.jsonValue;
            thuocTinh.longValue = record.longValue;
            thuocTinh.mauThuocTinh = record.mauThuocTinh;
            thuocTinh.mauThuocTinhId = record.mauThuocTinhId;
            thuocTinh.tramId = this.tramId;
            this.valueDieuKhien.push(thuocTinh);
            this.totalCount1 = this.valueDieuKhien.length;
        } else {
            const a = new Array<ThuocTinhDieuKhienTram>();
            // tslint:disable-next-line:no-identical-functions
            this.valueDieuKhien.forEach((e, index) => {
                if (index === indexRecord) {
                    a.push(record);
                } else {
                    a.push(e);
                }
            });
            this.valueDieuKhien = a;
            this.totalCount1 = this.valueDieuKhien.length;
        }
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            this._getValueForSave();
            this.inputData.forEach(rs => {
                rs.tramDieuKhienThuocTinh.forEach(e => {
                    delete e.mauThuocTinh;
                });
                rs.tramCanhBaoThuocTinh.forEach(e => {
                    delete e.mauThuocTinh;
                });
            });
            this._dmTramAppService.saveListCauHinhTram(this.inputData).pipe(
                finalize(() => {
                    this.saving = false;
                })
            ).subscribe(rs => {
                this.showCreateMessage();
                this.onSave.emit();
                this.close();
            });

        }
    }

    private _getValueForSave() {
        this.listTramId.forEach(rs => {
            const item = new CreateOrEditDanhMucTramDto();
            item.id = rs;
            item.mauDieuKhienId = this.form.controls.txtMauDieuKhien.value?.id;
            item.mauCanhBaoId = this.form.controls.txtMauCanhBao.value?.id;
            item.tramDieuKhienThuocTinh = this.valueDieuKhien;
            item.tramCanhBaoThuocTinh = this.valueCanhBao;
            this.inputData.push(item);
        });
    }
}
