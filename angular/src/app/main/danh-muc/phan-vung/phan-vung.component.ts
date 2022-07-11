import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DMPhanVungServiceProxy, PhanVungDto, PhanVungForView } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { PhanVungCreateOrEditDialogComponent } from './create-or-edit/phan-vung-create-or-edit-dialog.component';
@Component({
  selector: 'app-phan-vung',
  templateUrl: './phan-vung.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./phan-vung.component.scss']
})
export class PhanVungComponent extends AppComponentBase implements OnInit {
  exporting = false;
  keyword: any;
  loading = false;
  demos: any;
  cf: any;
  xoa = this.l('Delete1');
  totalCount: any;
  records: PhanVungForView[] = [];
  files1 = [];
  input: any;
  ngOnInit() {
    this.getDataPage(false);
  }
  constructor(
    injector: Injector,
    private _dmPhanVungAppService: DMPhanVungServiceProxy,
    private _modalService: BsModalService,
  ) { super(injector); }
  getDataPage(isSearch: boolean) {
    this.loading = true;
    this._dmPhanVungAppService.getAll(
      this.keyword || undefined,
      isSearch,
    ).pipe(finalize(() => { this.loading = false; }))
      .subscribe(result => {
        this.files1 = result;
        this.records = result;
        this.totalCount = result.length;
      });
  }
  delete(record: PhanVungDto, row: PhanVungForView) {
    const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
    '<p class="text-popup-xoa m-t-8">' + this.l('qlphanvung_swalphanvung') + record.phanVungCha.ten + this.l('isdeleted') + '</p>';
    if (row.children?.length > 0) {
      this.showExistMessage(this.l('qlphanvung_swalphanvungchakhongthexoa'));
    } else {
      this.swal.fire({
        html: html1,
        icon: 'warning',
        iconHtml: '<span class="icon1">&#9888</span>',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: this.confirmButtonColor,
        cancelButtonColor: this.cancelButtonColor,
        cancelButtonText: this.l(this.cancelButtonText),
        confirmButtonText: this.xoa
      }).then((result: { value: any; }) => {
        if (result.value) {
          this._dmPhanVungAppService.delete(record.phanVungCha.id).subscribe((res) => {
            if (res === 2) {
              this.showExistMessage(this.l('qlphanvung_swalphanvungdaduocsudung'));
            } else if (res === 1) {
              this.showExistMessage(this.l('faildelete'));
            } else {
              this.showDeleteMessage();
              this.getDataPage(false);
            }
          });
        }
      });
    }
  }
  createOredit(id?: number) {
    this._showCreateOrEditDemoDialog(id);
  }

  viewDetail(id?: number) {
    this._showCreateOrEditDemoDialog(id, true);
  }
  private _showCreateOrEditDemoDialog(id?: number, isView = false): void {
    // copy
    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      PhanVungCreateOrEditDialogComponent,
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
      this.getDataPage(false);
    });
  }
}
