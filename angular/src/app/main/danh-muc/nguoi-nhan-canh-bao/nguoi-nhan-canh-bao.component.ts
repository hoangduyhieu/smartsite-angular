import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {
    DMNguoiNhanCanhBaoServiceProxy, NguoiNhanCanhBaoDto
} from '@shared/service-proxies/service-proxies';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {AppComponentBase} from '@shared/app-component-base';
import {LazyLoadEvent} from 'primeng/api';
import {finalize} from 'rxjs/operators';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {NguoiNhanCanhBaoCreateOrEditDialogComponent} from './create-or-edit/nguoi-nhan-canh-bao-create-or-edit-dialog.component';

@Component({
  selector: 'app-nguoi-nhan-canh-bao',
  templateUrl: './nguoi-nhan-canh-bao.component.html',
    animations: [appModuleAnimation()],
  styleUrls: ['./nguoi-nhan-canh-bao.component.scss'],
})
export class NguoiNhanCanhBaoComponent extends AppComponentBase implements OnInit {
    @ViewChild('dt') table: Table;
    keyword = '';
    loading = true;
    nguoiNhanCanhBaos: NguoiNhanCanhBaoDto[] = [];
    totalCount = 0;

  constructor(
      injector: Injector,
      private _modalService: BsModalService,
      private _nguoiNhanCanhBaoService: DMNguoiNhanCanhBaoServiceProxy,
  ) { super(injector); }


  ngOnInit(): void {

  }

    getDataPage(lazyLoad?: LazyLoadEvent) {
        this.loading = true;
        this._nguoiNhanCanhBaoService.getAll(
            this.keyword,
            this.getSortField(this.table),
            lazyLoad ? lazyLoad.first : this.table.first,
            lazyLoad ? lazyLoad.rows : this.table.rows,
        ).pipe(finalize(() => { this.loading = false; }))
            .subscribe(result => {
                this.nguoiNhanCanhBaos = result.items;
                this.totalCount = result.totalCount;
            });
    }

    createDemo(id?: number) {
        this._showCreateOrEditDemoDialog(id);
    }

    // viewDemo(id?: number) {
    //     this._showCreateOrEditDemoDialog(id, true);
    // }

    protected _deleteDemo(demo: NguoiNhanCanhBaoDto) {
        const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
        '<p class="text-popup-xoa m-t-8">'
         + this.l('qlsdt_swalsodienthoai') + demo.sdt + this.l('qlsdt_swalvaemail') + demo.email +  this.l('isdeleted') + '</p>';
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
                this._nguoiNhanCanhBaoService.delete(demo.id).subscribe(() => {
                    this.showDeleteMessage();
                    this.getDataPage();
                });
            }
        });
    }

    private _showCreateOrEditDemoDialog(id?: number, isView = false): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            NguoiNhanCanhBaoCreateOrEditDialogComponent,
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
