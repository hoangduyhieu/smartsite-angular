import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import { DMTramServiceProxy, LookupTableDto, LookupTableServiceProxy, QuetThe, QuetTheOutput } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { NhanVienRaVaoTramCreateOrEditDialogComponent } from '../nhan-vien-ra-vao-tram/create-or-edit/nhan-vien-ra-vao-tram-create-or-edit-dialog.component';

@Component({
  selector: 'app-log-quet-the',
  templateUrl: './log-quet-the.component.html',
  styleUrls: ['./log-quet-the.component.scss'],
  animations: [appModuleAnimation()],
})
export class LogQuetTheComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  form: FormGroup;
  advancedFiltersVisible = false;
  isActive = false;
  loading = true;
  exporting = false;
  totalCount: number;
  thietBiList: QuetTheOutput[] = [];
  config = {
    animated: false
  };

  filterLoaiThietBi = new LookupTableDto();
  constructor(
    injector: Injector,
    private _dmQuanLyCanhBaoAppService: DMTramServiceProxy,
    public http: HttpClient,
    private _fileDownloadService: FileDownloadService,
    private _lookupTableService: LookupTableServiceProxy,
    private _modalService: BsModalService

  ) { super(injector); }

  ngOnInit(): void {
    this.khoiTaoForm();
  }

  khoiTaoForm() {
    this.form = new FormGroup({
      keyword: new FormControl(),
      ThoiGianTu: new FormControl(),
    });
  }
  timKiem() {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.getDataPageTB();
    }
  }

  getDataPageTB(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._dmQuanLyCanhBaoAppService.getAllQuetThe(
      this.form.controls.keyword.value || undefined,
      this.form.controls.ThoiGianTu.value ? this.form.controls.ThoiGianTu.value[0] : null,
      this.form.controls.ThoiGianTu.value ? this.form.controls.ThoiGianTu.value[1] : null,
      this.getSortField(this.table),
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows,
    ).pipe(finalize(() => { this.loading = false; }))
      .subscribe(result => {
        this.thietBiList = result.items;
        this.totalCount = result.totalCount;
      });
  }

  gg(obj: string, mucDo: string) {
    const b = JSON.parse(obj);
    return b != null ? b[mucDo]?.color : null;
  }

  viewUser(user: number): void {
    this._showCreateOrEditUserDialog(user, true);
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
    });
  }
}


