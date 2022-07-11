import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { Table } from 'primeng/table';
import {
    BoCanhBao,
    DMBoCanhBaoServiceProxy,
    DMNguoiNhanCanhBaoServiceProxy
} from '../../../../shared/service-proxies/service-proxies';
import { BoCanhBaoCreateOrEditDialogComponent } from './create-or-edit/bo-canh-bao-create-or-edit-dialog.component';
import { interval } from 'rxjs';

@Component({
    selector: 'app-bo-canh-bao',
    templateUrl: './bo-canh-bao.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./bo-canh-bao.component.scss'],
})

export class BoCanhBaoComponent extends AppComponentBase implements OnInit {
    @ViewChild('dt') table: Table;
    keyword = '';
    sorting = '';
    loading = true;
    boCanhBao: BoCanhBao[] = [];
    totalCount = 0;

    constructor(
        injector: Injector,
        private _modalService: BsModalService,
        private _boCanhBaoService: DMBoCanhBaoServiceProxy,
        public http: HttpClient,
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    getDataPage(lazyLoad?: LazyLoadEvent) {
        this.loading = true;
        this._boCanhBaoService.getAll(
            this.keyword.trim(),
            this.sorting,
            lazyLoad ? lazyLoad.first : this.table.first,
            lazyLoad ? lazyLoad.rows : this.table.rows,
        ).pipe(finalize(() => {
            this.loading = false;
        }))
            .subscribe(result => {
                this.boCanhBao = result.items;
                this.totalCount = result.totalCount;
            });
    }

    createDeviceProfile(id?: number) {
        this._showCreateOrEditDeviceProfile(id);
    }

    viewDeviceProfile(id?: number) {
        this._showCreateOrEditDeviceProfile(id, true);
    }

    protected _deleteDeviceProfile(boCanhBao: BoCanhBao) {
        const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
    '<p class="text-popup-xoa m-t-8">' + this.l('qlthietbi_luatcanhbao') + ': ' + boCanhBao.ten + this.l('isdeleted') + '</p>';
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
                this._boCanhBaoService.delete(boCanhBao.id).subscribe(() => {
                    this.showDeleteMessage();
                    this.getDataPage();
                });
            }
        });
    }

    private _showCreateOrEditDeviceProfile(id?: number, isView = false): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            BoCanhBaoCreateOrEditDialogComponent,
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
