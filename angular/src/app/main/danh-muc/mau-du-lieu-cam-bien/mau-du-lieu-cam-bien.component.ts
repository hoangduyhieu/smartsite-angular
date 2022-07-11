import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { FileDownloadService } from '@shared/file-download.service';
import { DMMauDuLieuCamBienServiceProxy, MauDuLieuCamBienDto } from '@shared/service-proxies/service-proxies';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { MauDuLieuCamBienCreateOrEditDialogComponent } from './create-or-edit/mau-du-lieu-cam-bien-create-or-edit-dialog.component';
@Component({
    selector: 'app-mau-du-lieu-cam-bien',
    templateUrl: './mau-du-lieu-cam-bien.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./mau-du-lieu-cam-bien.component.scss']
})
export class MauDuLieuCamBienComponent extends AppComponentBase implements OnInit {

    @ViewChild('dt') table: Table;
    keyword = '';
    loading = true;

    // Bên Server
    value: MauDuLieuCamBienDto[] = [];
    totalCount = 0;

    constructor(
        injector: Injector,
        private _modalService: BsModalService,
        private _mauDulieuCamBienService: DMMauDuLieuCamBienServiceProxy,
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

    protected _deleteDemo(demo: MauDuLieuCamBienDto) {
        const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
        '<p class="text-popup-xoa m-t-8">' + this.l('qldmdlcambien_danhmucdlcambien') + demo.tenHienThi + this.l('isdeleted') + '</p>';
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
                this._mauDulieuCamBienService.delete(demo.id).subscribe(() => {
                    this.showDeleteMessage();
                    this.getDataPage();
                });
            }
        });
    }


    getDataPage(lazyLoad?: LazyLoadEvent) {
        this.loading = true;
        this._mauDulieuCamBienService.getAll(
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
            MauDuLieuCamBienCreateOrEditDialogComponent,
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
}
