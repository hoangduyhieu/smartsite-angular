import { NhanVienRaVaoTramDtoPagedResultDto } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DMNhanVienRaVaoTramServiceProxy, NhanVienRaVaoTramDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { NhanVienRaVaoTramCreateOrEditDialogComponent } from './create-or-edit/nhan-vien-ra-vao-tram-create-or-edit-dialog.component';
@Component({
    selector: 'app-nhan-vien-ra-vao-tram',
    templateUrl: './nhan-vien-ra-vao-tram.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./nhan-vien-ra-vao-tram.component.scss']
})
export class NhanVienRaVaoTramComponent extends AppComponentBase implements OnInit {
    @ViewChild('dt') table: Table;
    nhanViens: NhanVienRaVaoTramDto[] = [];
    nhanViensSelected: NhanVienRaVaoTramDto[] = [];
    nhanVienIds: number[] = [];
    nhanVienNames: string[] = [];
    keyword = '';
    isActive: boolean | null;
    advancedFiltersVisible = false;
    loading = true;
    totalCount = 0;
    first = 0;
    constructor(
      injector: Injector,
      private _modalService: BsModalService,
      private _dMNhanVienRaVaoTramServiceProxy: DMNhanVienRaVaoTramServiceProxy,
    ) {
      super(injector);
    }
    ngOnInit(): void {
    }
    getDataPage(lazyLoad?: LazyLoadEvent) {
      this.loading = true;
      this._dMNhanVienRaVaoTramServiceProxy
        .getAll(
          this.keyword || undefined,
          this.getSortField(this.table),
          lazyLoad ? lazyLoad.first : this.first,
          lazyLoad ? lazyLoad.rows : this.table.rows,
        ).subscribe((result: NhanVienRaVaoTramDtoPagedResultDto) => {
          this.loading = false;
          this.nhanViens = result.items;
          this.totalCount = result.totalCount;
        });
    }
    deleteNhanViens() {
      this.nhanVienIds = [];
      this.nhanViensSelected.forEach(e => {
        this.nhanVienIds.push(e.id);
        this.nhanVienNames.push(e.ten);
      });
      const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
        '<p class="text-popup-xoa m-t-8">'
         + this.l('qlnv_dsnhanviendachonsebixoa') + '</p>';
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
          this._dMNhanVienRaVaoTramServiceProxy.delete(this.nhanVienIds).subscribe(() => {
            this.showDeleteMessage();
            this.getDataPage();
          });
        }
      });
    }
    protected _delete(user: NhanVienRaVaoTramDto): void {
      this.nhanVienIds = [];
      const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
        '<p class="text-popup-xoa m-t-8">'
         + this.l('qlnv_swalnhanvien') + user.ten + this.l('isdeleted') + '</p>';
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
            this.nhanVienIds.push(user.id);
            this._dMNhanVienRaVaoTramServiceProxy.delete(this.nhanVienIds).subscribe(() => {
              this.showDeleteMessage();
              this.getDataPage();
            });
          }
        });
    }

    createUser(): void {
      this._showCreateOrEditUserDialog();
    }
    editUser(user: NhanVienRaVaoTramDto): void {
      this._showCreateOrEditUserDialog(user.id);
    }
    viewUser(user: NhanVienRaVaoTramDto): void {
      this._showCreateOrEditUserDialog(user.id, true);
    }
    private _showCreateOrEditUserDialog(idUser?: number, isView = false): void {
      let createOrEditUserDialog: BsModalRef;
      if (!idUser) {
        createOrEditUserDialog = this._modalService.show(
          NhanVienRaVaoTramCreateOrEditDialogComponent,
          {
            class: 'modal-xl',
          }
        );
      } else {
        createOrEditUserDialog = this._modalService.show(
          NhanVienRaVaoTramCreateOrEditDialogComponent,
          {
            class: 'modal-xl',
            initialState: {
              id: idUser,
              isView,
            },
          }
        );
      }
      createOrEditUserDialog.content.onSave.subscribe(() => {
        this.getDataPage();
      });
    }
  }
