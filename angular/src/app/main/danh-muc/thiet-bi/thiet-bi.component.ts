import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { computeSegDraggable } from '@fullcalendar/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppLoaiThietBi } from '@shared/AppEnums';
import { FileDownloadService } from '@shared/file-download.service';
import { DemoServiceProxy, DMThietBiServiceProxy, LookupTableDto, ThietBiDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialog, LazyLoadEvent, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { ThietBiCreateOrEditDialogComponent } from './create-or-edit/thiet-bi-create-or-edit-dialog.component';
@Component({
    selector: 'app-thiet-bi',
    templateUrl: './thiet-bi.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./thiet-bi.component.scss']
})
export class ThietBiComponent extends AppComponentBase implements OnInit {
    @ViewChild('dt') table: Table;
    @Input() tramId: number;
    @Input() tbEntityId: string;

    form: FormGroup;
    keyword = '';
    advancedFiltersVisible = false;
    isActive = false;
    loading = true;
    exporting = false;
    thietBiList = [];
    input: any;
    totalCount = 0;
    config = {
        animated: false
    };

    filterLoaiThietBi = new LookupTableDto();
    arrLoaiThietBi: LookupTableDto[] = [];
    constructor(
        injector: Injector,
        private _modalService: BsModalService,
        private _thietBiService: DMThietBiServiceProxy,
        public http: HttpClient,
        private _fileDownloadService: FileDownloadService,

    ) { super(injector); }

    ngOnInit(): void {
        this.khoiTaoForm();
        this._thietBiService.getAllLoaiThietBi().subscribe(rs => {
            this.arrLoaiThietBi = rs;
        });
    }

    khoiTaoForm() {
        this.form = new FormGroup({
            TextInput1: new FormControl(),
            TextInput2: new FormControl()
        });
    }

    getDataPageTB(lazyLoad?: LazyLoadEvent) {
        this.loading = true;
        this._thietBiService.getListFromThingsboard(this.tbEntityId, this.tramId).subscribe(rs => {
            this._thietBiService.getAll(
                this.keyword,
                this.filterLoaiThietBi?.id,
                this.tramId,
                this.getSortField(this.table),
                lazyLoad ? lazyLoad.first : this.table.first,
                lazyLoad ? lazyLoad.rows : this.table.rows,
            ).pipe(finalize(() => { this.loading = false; }))
                .subscribe(result => {
                    this.thietBiList = result.items;
                    this.totalCount = result.totalCount;
                });
        });
    }

    themMoi() {
        this._showCreateOrEditDialog(this.tramId);
    }
    sua(record: ThietBiDto) {
        this._showCreateOrEditDialog(this.tramId, record, record.id);
    }
    xem(record: ThietBiDto) {
        this._showCreateOrEditDialog(this.tramId, record, record.id, true);
    }
    private _showCreateOrEditDialog(tramId?: number, record?: ThietBiDto, id?: number, isView = false): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            ThietBiCreateOrEditDialogComponent,
            {
                class: 'modal-lg',
                ignoreBackdropClick: true,
                initialState: {
                    id,
                    record,
                    isView,
                    tramId,
                },
            }
        );

        // ouput emit
        createOrEditUserDialog.content.onSave.subscribe(() => {
            this.getDataPageTB();
            this.getDataPageTB();
        });
    }
    protected _delete(record: ThietBiDto) {
        const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
    '<p class="text-popup-xoa m-t-8">'
     + this.l('qlthietbi_thietbi') + record.ten + this.l('isdeleted') + '</p>';
        this.swal.fire({
            html: html1,
            icon: 'warning',
            iconHtml: '<span class="icon1">&#9888</span>',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: this.confirmButtonColor,
            cancelButtonColor: this.cancelButtonColor,
            cancelButtonText: this.l(this.cancelButtonText),
            confirmButtonText: this.l(this.confirmButtonText)
        }).then((result) => {
            if (result.value) {
                this._thietBiService.delete(record.id).subscribe(() => {
                    this.showDeleteMessage();
                    this.getDataPageTB();
                });
            }
        });
    }
}
