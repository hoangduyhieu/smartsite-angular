import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import {
    CreateOrEditDanhMucTramDto,
    DMMauCanhBaoServiceProxy,
    DMMauDieuKhienServiceProxy,
    DMTramServiceProxy, LookupTableDto,
    ThuocTinhCanhBaoTramDto,
    ThuocTinhDieuKhienTramDto,
    ThuocTinhDieuKhienTramInput,
    Tram, TramCanhBaoThuocTinh,
    TramDieuKhienThuocTinh
} from '@shared/service-proxies/service-proxies';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Accordion } from 'primeng/accordion';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditMauCanhBaoTramComponent } from './create-or-edit-mau-canh-bao-tram/create-or-edit-mau-canh-bao-tram.component';
import { CreateOrEditMauDieuKhienTramComponent } from './create-or-edit-mau-dieu-khien/create-or-edit-mau-dieu-khien-tram.component';
@Component({
    selector: 'app-cau-hinh-tram',
    templateUrl: './cau-hinh-tram.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./cau-hinh-tram.component.scss']
})
export class CauHinhTramComponent extends AppComponentBase implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    @ViewChild('groupTab', { static: true }) groupTab: Accordion;
    @ViewChild('dt') table: Table;
    @ViewChild('dt1') table1: Table;
    @Input() tramId: number;
    form: FormGroup;
    valueDieuKhien: any[];
    valueDieuKhienFake: any[];
    valueCanhBao: any[];
    valueCanhBaoFake: any[];
    saving = false;
    arrKieuDuLieu = ['', 'Boolean', 'String', 'Long', 'Double', 'Json'];
    optionMauDieuKhien: LookupTableDto[] = [];
    optionMauCanhBao: LookupTableDto[] = [];
    display: string;
    inputData: CreateOrEditDanhMucTramDto = new CreateOrEditDanhMucTramDto();
    input1: number;
    input2: number;
    selectedList: TramDieuKhienThuocTinh[] = [];
    selectedListCanhBao: TramCanhBaoThuocTinh[] = [];
    inputExcel: ThuocTinhDieuKhienTramInput;
    loading = true;
    loading2 = true;
    collapsedAll = false;
    totalCount1 = 0;
    totalCount2 = 0;
    exporting = false;
    disableSave = true;
    disableDK = true;
    disableCB = true;
    mauDKMoi: number;
    mauCBMoi: number;

    // String
    iconString = '<span class="icon1">&#9888</span>';
    conf = this.l('Are You Sure?');
    h3start = '<h3 class="title-popup-xoa m-t-24" >';
    h3end = '</h3>';
    pstart = '<p class="text-popup-xoa m-t-8">';
    pend = '</p>';

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        private _modalService: BsModalService,
        public http: HttpClient,
        private _fileDownloadService: FileDownloadService,
        private _dmTramAppService: DMTramServiceProxy,
        private _dmMauDieuKhienService: DMMauDieuKhienServiceProxy,
        private _dmMauCanhBaoService: DMMauCanhBaoServiceProxy,
    ) { super(injector); }

    ngOnInit(): void {
        this.selectedList = [];
        this.selectedListCanhBao = [];
        this.khoiTaoForm();
        this.getDataPage();
        this.getDataPageCanhBao();
        this.collapsedAll = false;
        this.setCollapseAll(this.collapsedAll, [0]);
        this.checkDisable();
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

    khoiTaoForm() {
        this.form = this._fb.group({
            txtMauDieuKhien: [],
            txtMauCanhBao: [],
        });
    }

    // tslint:disable-next-line:cognitive-complexity
    checkDisable() {
        this.form.controls.txtMauDieuKhien.valueChanges.subscribe(w => {
            if (w !== null && w !== undefined) {
                if (w.id !== this.input1) {
                    this.disableDK = false;
                } else {
                    this.disableDK = true;
                }
            } else if (this.input1 !== undefined && this.input1 !== null) {
                this.disableDK = false;
            }
        });

        this.form.controls.txtMauCanhBao.valueChanges.subscribe(w => {
            if (w !== null && w !== undefined) {
                if (w.id !== this.input2) {
                    this.disableCB = false;
                } else {
                    this.disableCB = true;
                }
            } else if (this.input2 !== undefined && this.input2 !== null) {
                this.disableCB = false;
            }
        });
    }

    getDataPage(lazyLoad?: LazyLoadEvent) {
        this.loading = true;
        this._dmTramAppService.getAllThuocTinhDieuKhien(
            this.tramId,
            this.getSortField(this.table),
            lazyLoad ? lazyLoad.first : this.table?.first,
            lazyLoad ? lazyLoad.rows : this.table?.rows,
        ).pipe(finalize(() => { this.loading = false; }))
            .subscribe(result => {
                this.input1 = result.items[0].mauDieuKhienId;
                this._dmMauDieuKhienService.getAllLookupTableMauDieuKhien().subscribe(rs => {
                    this.optionMauDieuKhien = rs;
                    this.form.controls.txtMauDieuKhien.setValue(this.optionMauDieuKhien.find(e => e.id === this.input1));
                });
                this.valueDieuKhien = result.items[0].tramDieuKhienThuocTinh;
                this.totalCount1 = result.items[0].tramDieuKhienThuocTinh.length;
            });
    }

    getDataPageFake(lazyLoad?: LazyLoadEvent) {
        this.loading = true;
        this._dmTramAppService.getAllThuocTinhDieuKhienFake(
            this.tramId,
            this.getSortField(this.table),
            lazyLoad ? lazyLoad.first : this.table?.first,
            lazyLoad ? lazyLoad.rows : this.table?.rows,
        ).pipe(finalize(() => { this.loading = false; }))
            .subscribe(result => {
                this.valueDieuKhienFake = result.items;
                this.totalCount1 = result.items.length;
            });
    }

    // ----------------------------------------------------
    getDataCanhBaoPageFake(lazyLoad?: LazyLoadEvent) {
        this.loading2 = true;
        this._dmTramAppService.getAllThuocTinhCanhBaoFake(
            this.tramId,
            this.getSortField(this.table1),
            lazyLoad ? lazyLoad.first : this.table1?.first,
            lazyLoad ? lazyLoad.rows : this.table1?.rows,
        ).pipe(finalize(() => { this.loading2 = false; }))
            .subscribe(result => {
                this.valueCanhBaoFake = result.items;
                this.totalCount2 = result.items.length;
            });
    }

    getDataPageCanhBao(lazyLoad?: LazyLoadEvent) {
        this.loading2 = true;
        this._dmTramAppService.getAllThuocTinhCanhBao(
            this.tramId,
            this.getSortField(this.table),
            lazyLoad ? lazyLoad.first : this.table?.first,
            lazyLoad ? lazyLoad.rows : this.table?.rows,
        ).pipe(finalize(() => { this.loading2 = false; }))
            .subscribe(result => {
                this.input2 = result.items[0].mauCanhBaoId;
                this._dmMauCanhBaoService.getAllLookupTableMauCanhBao().subscribe(rs => {
                    this.optionMauCanhBao = rs;
                    this.form.controls.txtMauCanhBao.setValue(this.optionMauCanhBao.find(e => e.id === this.input2));
                });
                this.valueCanhBao = result.items[0].tramCanhBaoThuocTinh;
                this.totalCount2 = result.items[0].tramCanhBaoThuocTinh.length;
            });
    }

    createMDKT(record?: TramDieuKhienThuocTinh, idRecord?: number) {
        const sorted = this.getSortField(this.table);
        this._showCreateOrEditMDKTDialog(this.tramId, record, idRecord, sorted);
    }

    createMCBT(record?: TramDieuKhienThuocTinh, idRecord?: number) {
        const sorted = this.getSortField(this.table1);
        this._showCreateOrEditMCBTDialog(this.tramId, record, idRecord, sorted);
    }

    private _showCreateOrEditMDKTDialog(tramId?: number, record?: TramDieuKhienThuocTinh, idRecord?: number, sorted?: string): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            CreateOrEditMauDieuKhienTramComponent,
            {
                class: 'modal-xl',
                ignoreBackdropClick: true,
                initialState: {
                    tramId,
                    record,
                    idRecord,
                    sorted,
                },
            }
        );

        // ouput emit
        createOrEditUserDialog.content.onSave.subscribe(() => {
            this.getDataPageFake();
        });
    }

    private _showCreateOrEditMCBTDialog(tramId?: number, record?: TramDieuKhienThuocTinh, idRecord?: number, sorted?: string): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            CreateOrEditMauCanhBaoTramComponent,
            {
                class: 'modal-xl',
                ignoreBackdropClick: true,
                initialState: {
                    tramId,
                    record,
                    idRecord,
                    sorted,
                },
            }
        );

        // ouput emit
        createOrEditUserDialog.content.onSave.subscribe(() => {
            this.getDataCanhBaoPageFake();
        });
    }

    deleteDemoDieuKhien(demo: TramDieuKhienThuocTinh, idRecord?: number) {
        const html2 = this.h3start + this.conf + this.h3end +
            this.pstart + this.l('cht_thuoctinhdieukhien') + demo.mauThuocTinh.tenHienThi + this.l('isdeleted') + this.pend;
        this.swal.fire({
            html: html2,
            icon: 'warning',
            iconHtml: this.iconString,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: this.confirmButtonColor,
            cancelButtonColor: this.cancelButtonColor,
            cancelButtonText: this.l(this.cancelButtonText),
            confirmButtonText: this.l(this.deleteButtonText)
        }).then((result) => {
            if (result.value) {
                demo.tram = new Tram();
                this._dmTramAppService.xoaMauDieuKhienTram(demo).subscribe((rs) => {
                    if (rs) {
                        this.showDeleteMessage();
                        this.getDataPageFake();
                    }
                });
            }
        });
    }

    deleteListDieuKhien(demo: TramDieuKhienThuocTinh[]) {
        const html1 = this.h3start + this.conf + this.h3end +
            this.pstart + this.l('cht_swaldanhsachdieukhienbixoa') + this.pend;
        this.swal.fire({
            html: html1,
            icon: 'warning',
            iconHtml: this.iconString,
            showCancelButton: true,
            confirmButtonColor: this.confirmButtonColor,
            cancelButtonColor: this.cancelButtonColor,
            cancelButtonText: this.l(this.cancelButtonText),
            confirmButtonText: this.l(this.deleteButtonText)
        }).then((result) => {
            if (result.value) {
                demo.forEach(rs => {
                    rs.tram = new Tram();
                });
                // tslint:disable-next-line:no-identical-functions
                this._dmTramAppService.xoaListMauDieuKhienTram(demo).subscribe((rs2) => {
                    if (rs2) {
                        this.showDeleteMessage();
                        this.getDataPageFake();
                        this.selectedList = [];
                    }
                });
            }
        });
    }

    deleteListCanhBao(demos: TramCanhBaoThuocTinh[]) {
        const html1 = this.h3start + this.conf + this.h3end +
            this.pstart + this.l('cht_swaldanhsachcanhbaobixoa') + this.pend;
        this.swal.fire({
            icon: 'warning',
            html: html1,
            iconHtml: this.iconString,
            showCancelButton: true,
            confirmButtonColor: this.confirmButtonColor,
            cancelButtonColor: this.cancelButtonColor,
            cancelButtonText: this.l(this.cancelButtonText),
            confirmButtonText: this.l(this.deleteButtonText)
        }).then((result) => {
            if (result.value) {
                demos.forEach(rs => {
                    rs.tram = new Tram();
                });
                // tslint:disable-next-line:no-identical-functions
                this._dmTramAppService.xoaListMauCanhBaoTram(demos).subscribe((rs) => {
                    if (rs) {
                        this.showDeleteMessage();
                        this.getDataCanhBaoPageFake();
                        this.selectedListCanhBao = [];
                    }
                });
            }
        });
    }

    deleteDemoCanhBao(demo: TramCanhBaoThuocTinh, idRecord?: number) {
        const html1 = this.h3start + this.conf + this.h3end +
            this.pstart + this.l('cht_thuoctinhcanhbao') + demo.mauThuocTinh.tenHienThi + this.l('isdeleted') + this.pend;
        this.swal.fire({
            icon: 'warning',
            html: html1,
            iconHtml: this.iconString,
            showCancelButton: true,
            confirmButtonColor: this.confirmButtonColor,
            cancelButtonColor: this.cancelButtonColor,
            cancelButtonText: this.l(this.cancelButtonText),
            confirmButtonText: this.l(this.deleteButtonText)
        }).then((result) => {
            if (result.value) {
                demo.tram = new Tram();
                // tslint:disable-next-line:no-identical-functions
                this._dmTramAppService.xoaMauCanhBaoTram(demo).subscribe((rs1) => {
                    if (rs1) {
                        this.showDeleteMessage();
                        this.getDataCanhBaoPageFake();
                    }
                });
            }
        });
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            this._getValueForSave();
            this.inputData.thuocTinhDieuKhien = new Array<ThuocTinhDieuKhienTramDto>();
            this.inputData.thuocTinhCanhBao = new Array<ThuocTinhCanhBaoTramDto>();
            this.inputData.thuocTinhDieuKhien = this.valueDieuKhienFake;
            this.inputData.thuocTinhCanhBao = this.valueCanhBaoFake;
            this._dmTramAppService.createMauDieuKhienCanhBaoIdTram(this.inputData).pipe(
                finalize(() => {
                    this.saving = false;
                })
            ).subscribe(rs => {
                this.showCreateMessage();
                this.onSave.emit();
            });
        }
    }

    exportToExcel() {
        this.exporting = true;
        this.inputExcel = new ThuocTinhDieuKhienTramInput();
        this.inputExcel.tramId = this.tramId;
        this.inputExcel.skipCount = 0;
        this.inputExcel.maxResultCount = 10000000;
        this._dmTramAppService.exportToExcelTramDieuKhienThuocTinh(this.inputExcel).subscribe((result) => {
            this._fileDownloadService.downloadTempFile(result);
            this.exporting = false;
        }, () => {
            this.exporting = false;
        });
    }

    private _getValueForSave() {
        this.inputData.id = this.tramId;
        this.inputData.mauDieuKhienId = this.form.controls.txtMauDieuKhien.value?.id;
        this.inputData.mauCanhBaoId = this.form.controls.txtMauCanhBao.value?.id;
    }
}
