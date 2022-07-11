import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ImportExcelDialogComponent } from '@shared/components/import-excel/import-excel-dialog.component';
import { FileDownloadService } from '@shared/file-download.service';
import { DMMauDieuKhienServiceProxy, MauDieuKhienDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { MauDieuKhienCreateOrEditDialogComponent } from './create-or-edit/mau-dieu-khien-create-or-edit-dialog.component';

const URL = AppConsts.remoteServiceBaseUrl + '/api/Upload/DemoUpload';
@Component({
    selector: 'app-mau-dieu-khien',
    templateUrl: './mau-dieu-khien.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./mau-dieu-khien.component.scss']
})
export class MauDieuKhienComponent extends AppComponentBase implements OnInit {

    @ViewChild('dt') table: Table;
    form: FormGroup;
    keyword = '';
    loading = true;
    exporting = false;
    // Bên Server
    value: MauDieuKhienDto[] = [];
    input: MauDieuKhienComponent;
    totalCount = 0;

    constructor(
        injector: Injector,
        private _modalService: BsModalService,
        private _mauDieuKhienService: DMMauDieuKhienServiceProxy,
        public http: HttpClient,
        private _fileDownloadService: FileDownloadService,
    ) { super(injector); }

    ngOnInit(): void {
    }

    createDemo(id?: number) {
        this._showCreateOrEditDemoDialog(id);
    }

    viewDemo(id?: number) {
        this._showCreateOrEditDemoDialog(id, true);
    }

    getDataPage(lazyLoad?: LazyLoadEvent) {
        this.loading = true;
        this._mauDieuKhienService.getAll(
            this.keyword,
            this.getSortField(this.table),
            lazyLoad ? lazyLoad.first : this.table.first,
            lazyLoad ? lazyLoad.rows : this.table.rows,
        ).pipe(finalize(() => { this.loading = false; }))
            .subscribe(result => {
                this.value = result.items;
                this.totalCount = result.totalCount;
            });
    }

    private _showCreateOrEditDemoDialog(id?: number, isView = false): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            MauDieuKhienCreateOrEditDialogComponent,
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
            this._mauDieuKhienService.downloadFileMau().subscribe(result => {
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
                this._mauDieuKhienService.importFileExcel(res['result'][0]).subscribe((message) => {
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

    taiFileMau(id: number) {
        this.exporting = true;
        this._mauDieuKhienService.exportToExcel(id).subscribe((result) => {
          this._fileDownloadService.downloadTempFile(result);
          this.exporting = false;
        }, () => {
          this.exporting = false;
        });
      }

    protected _deleteDemo(demo: MauDieuKhienDto) {
        const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
            '<p class="text-popup-xoa m-t-8">' + this.l('qlmaudk_maudieukhien') + demo.ten + this.l('isdeleted') + '</p>';
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
                this._mauDieuKhienService.delete(demo.id).subscribe(() => {
                    this.showDeleteMessage();
                    this.getDataPage();
                });
            }
        });
    }
}
