import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ImportExcelDialogComponent } from '@shared/components/import-excel/import-excel-dialog.component';
import { MultiSelectTree } from '@shared/dft/components/permission-tree-edit.model';
import { FileDownloadService } from '@shared/file-download.service';
import { DanhSachTramView, DMTramServiceProxy, DSGopTram } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TreeviewItem } from 'ngx-treeview';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { TramCreateOrEditDialogComponent } from './create-or-edit/tram-create-or-edit-dialog.component';
import { ConfigNhieuTramComponent } from './tram-config/config-nhieu-tram/cau-hinh-nhieu-tram.component';
import { AppConsts } from '@shared/AppConsts';
const URL = AppConsts.remoteServiceBaseUrl + '/api/Upload/DemoUpload';

@Component({
    selector: 'app-tram',
    templateUrl: './tram.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./tram.component.scss']
})
export class TramComponent extends AppComponentBase implements OnInit, OnDestroy {
    @ViewChild('dt') table: Table;
    exporting = false;
    keyword: any;
    loading = false;
    demos: any;
    totalCount: any;
    records: DanhSachTramView[] = [];
    selectedList: DanhSachTramView[] = [];
    selectedLists: DSGopTram[] = [];
    dataSelected: DanhSachTramView[] = [];
    listTrangThaiKetNoi = [{ id: 1, displayName: this.l('trangthaiketnoi_1') }, { id: 2, displayName: this.l('trangthaiketnoi_2') }];
    listTrangThaiCanhBao = [{ id: 1, displayName: this.l('trangthaicanhbao_1') }, { id: 2, displayName: this.l('trangthaicanhbao_2') }];
    input: any;
    filterPhanVung: any;
    listVung: TreeviewItem[];
    filterTrangThaiKetNoi: any;
    filterTrangThaiCanhBao: any;

    toChucItems: MultiSelectTree;
    toChucValue: number[];
    id: NodeJS.Timeout;

    constructor(
        injector: Injector,
        private _dmTramAppService: DMTramServiceProxy,
        private _modalService: BsModalService,
        private _fileDownloadService: FileDownloadService,
        public http: HttpClient,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.selectedLists = [];
        this.selectedList = [];
        this.dataSelected = [];
        this._dmTramAppService.getAllPhanVungTree(undefined).subscribe(rs => {
            this.listVung = this.getTreeviewItem(rs);
            this.filterPhanVung = this.getTreeviewItem(rs) ? this.getTreeviewItem(rs)[0]?.value : undefined;
            this.getDataPage();
        });
        this.id = setInterval(() => {
            this.getDataPage();
        }, 60000);
    }

    ngOnDestroy() {
        if (this.id) {
            clearInterval(this.id);
        }
    }

    getDataPage() {
        this.selectedLists = [];
        this.selectedList = [];
        this.dataSelected = [];
        this.loading = true;
        this._dmTramAppService.getAll(
            this.keyword,
            this.filterPhanVung,
            this.filterTrangThaiKetNoi?.id,
            this.filterTrangThaiCanhBao?.id
        ).pipe(finalize(() => { this.loading = false; }))
            .subscribe(result => {
                this.records = result;
                this.totalCount = result.length;
            });
    }

    protected _deleteDemo(demo: DSGopTram) {
        const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
            '<p class="text-popup-xoa m-t-8">'
            + this.l('deltram') + demo.tenTram + this.l('isdeleted') + '</p>';
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
                this._dmTramAppService.delete(demo.tramId).subscribe(() => {
                    this.showDeleteMessage();
                    this.getDataPage();
                });
            }
        });
    }

    deleteListTram(record: any) {
        const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
            '<p class="text-popup-xoa m-t-8">'
            + this.l('dellisttram') + '</p>';
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
                this._dmTramAppService.xoaListTram(record).subscribe((w) => {
                    if (w > 0) {
                        this.showSuccessMessage(this.l('XoaTramThanhCong', w));
                    } else {
                        this.showErrorMessage(this.l('KhongTramNaoDuocXoa'));
                    }
                    this.getDataPage();
                });
            }
        });
    }

    createDemo(id?: number) {
        this._showCreateOrEditDemoDialog(id);
    }

    viewDemo(id?: number) {
        this._showCreateOrEditDemoDialog(id, true);
    }

    thietLapCauHinh() {
        const a = this.selectedList.filter(e => e.expanded === false);
        if (a !== undefined) {
            // Lọc bản ghi trùng
            const distinct = a.filter(
                (tram, i, arr) => arr.findIndex(t => t.data.tramId === tram.data.tramId) === i
            );

            const c = distinct.map(e => e.data.tramId);
            this._showCreateOrEditConfigNhieuTramDialog(c);
            // xử lý tiếp từ distinct để lưu cấu hình cho list trạm
        }
    }

    private _showCreateOrEditDemoDialog(id?: number, isView = false): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            TramCreateOrEditDialogComponent,
            {
                class: 'modal-xl',
                ignoreBackdropClick: true,
                initialState: {
                    id,
                    isView,
                },
            }
        );

        // ouput emit
        createOrEditUserDialog.content.onSave.subscribe(() => {
            this.getDataPage();
        });
    }

    private _showCreateOrEditConfigNhieuTramDialog(listTramId?: number[]): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            ConfigNhieuTramComponent,
            {
                class: 'modal-xl',
                ignoreBackdropClick: true,
                initialState: {
                    listTramId,
                },
            }
        );

        // ouput emit
        createOrEditUserDialog.content.onSave.subscribe(() => {
            this.getDataPage();
        });
    }
    importExcel() {
        this._showImportDemoDialog();
    }

    private _showImportDemoDialog(): void {
        let importExcelDialog: BsModalRef;

        importExcelDialog = this._modalService.show(
            ImportExcelDialogComponent,
            {
                class: 'modal-lg',
                ignoreBackdropClick: true,
                initialState: {
                    maxFile: 1,
                    excelAcceptTypes: this.excelAcceptTypes
                }
            }
        );

        // Tải file mẫu
        importExcelDialog.content.onDownload.subscribe(() => {
            this._dmTramAppService.downloadFileMau().subscribe(result => {
                importExcelDialog.content.downLoading = false;
                this._fileDownloadService.downloadTempFile(result);
            });
        });

        // Upload
        importExcelDialog.content.onSave.subscribe((ouput) => {
            importExcelDialog.content.returnMessage = this.l('importexcel_uploading');
            const formdata = new FormData();
            for (let i = 0; i < ouput.length; i++) {
                formdata.append((i + 1) + '', ouput[i]);
            }
            this.http.post(URL, formdata).subscribe((res) => {
                this._dmTramAppService.importFileExcel(res['result'][0]).subscribe((message) => {
                    importExcelDialog.content.returnMessage = message;
                    importExcelDialog.content.uploading = false;
                    this.showUploadMessage();
                });
            });
        });

        // Close
        importExcelDialog.content.onClose.subscribe(() => {
            this.getDataPage();
        });
    }

}
