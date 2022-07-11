/* tslint:disable */
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { CommonComponent } from '@shared/dft/components/common.component';
import { DanhSachCanhBaoOutput, DMCanhBaoOutput, DMTramServiceProxy, LookupTableDto,
  LookupTableServiceProxy, ThietBiDto
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { LazyLoadEvent, Table } from 'primeng';
import { loadModules } from 'esri-loader';
import esri = __esri; // Esri TypeScript Types
import { Point } from 'esri/geometry';
import { AppLoaiThietBi } from '@shared/AppEnums';
import { FileDownloadService } from '@shared/file-download.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { ThietBiCreateOrEditDialogComponent } from '@app/main/danh-muc/thiet-bi/create-or-edit/thiet-bi-create-or-edit-dialog.component';
import { forkJoin, interval, Subject, Subscription } from 'rxjs';
import { XemChiTietCanhBaoComponent } from './xem-chi-tiet/xem-chi-tiet-canh-bao/xem-chi-tiet-canh-bao.component';
import * as signalR from '@aspnet/signalr';
@Component({
  selector: 'app-canh-bao-tram-view',
  templateUrl: './canh-bao-tram-view.component.html',
  styleUrls: ['./canh-bao-tram-view.component.scss'],
  animations: [appModuleAnimation()],
})
export class CanhBaoTramViewComponent extends AppComponentBase implements OnInit {

  @ViewChild('dt') table: Table;
  @Input() tramId: number;
  subscription: Subscription;
  form: FormGroup;
  advancedFiltersVisible = false;
  isActive = false;
  loading = true;
  exporting = false;
  thietBiList: DanhSachCanhBaoOutput[];
  listLoaiCanhBao: LookupTableDto[] = [];
  connection: signalR.HubConnection;
  connectionEstablished = new Subject<boolean>();
  listTrangThaiCanhBao1 = [
    { id: 1, displayName: this.l('ACTIVE')},
    { id: 2, displayName: this.l('ACK')},
    { id: 3, displayName: this.l('CLEARED')},
    { id: 4, displayName: this.l('UNACK')},
  ];
  listTrangThaiCanhBao: LookupTableDto[] = [];
  listMucDoCanhBao: LookupTableDto[] = [];
  input: any;
  tuNgay = undefined;
  denNgay = undefined;
  totalCount = 0;
  config = {
    animated: false
  };

  filterLoaiThietBi = new LookupTableDto();
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dmTramAppService: DMTramServiceProxy,
    public http: HttpClient,
    private _fileDownloadService: FileDownloadService,
    private _lookupTableService: LookupTableServiceProxy,

  ) { super(injector); }

  ngOnInit(): void {
    this.khoiTaoForm();
    this.hubCanhBao();
    this.hubUpdateCanhBao();
    forkJoin(
      this._lookupTableService.getAllLoaiCanhBao(),
      this._lookupTableService.getAllTrangThaiCanhBao()
    ).subscribe(([loaiCanhBao, trangThaiCanhBao]) => {
      this.listLoaiCanhBao = loaiCanhBao;
      this.listTrangThaiCanhBao = trangThaiCanhBao;
    });
    this.subscription = interval(45000).subscribe(x => {
      this.getDataPageTB();
    });
  }

  khoiTaoForm() {
    this.form = new FormGroup({
      keyword: new FormControl(),
      MucDo: new FormControl(),
      LoaiCanhBao: new FormControl(),
      TrangThai: new FormControl(),
      ThoiGianTu: new FormControl(),
      ThoiGianDen: new FormControl(),
      GioTu: new FormControl(),
      GioDen: new FormControl(),
    });
  }
  timKiem() {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.getDataPageTB();
    }
  }

  getDataPageTB(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._dmTramAppService.getAllDanhSachCanhBao(
      this.pipeSearch(this.form.controls.keyword.value) || undefined,
      this.form.controls.TrangThai.value?.id || undefined,
      this.tramId,
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

  protected _xacNhan(record: DanhSachCanhBaoOutput) {
    let tt: string;
    if (record.trangThai === 'ACTIVE_UNACK') {
      tt = 'ACTIVE_ACK';
    } else {
      tt = 'CLEARED_ACK';
    }
    const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
    '<p class="text-popup-xoa m-t-8">'
     +  this.l('cbtram_canhbaoseduoccapnhattrangthaila') + this.l(tt) + '</p>';
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
        const options1 = {
          timer: 1000,
        };
        this._dmTramAppService.xacNhanCanhBao(record.idCanhBao).subscribe((rs) => {
          if (rs) {
            this.showSuccessMessageTimer(this.l('successconfirm', '', options1));
          } else {
            this.showWarningMessageTimer(this.l('failconfirm'), '', options1);
          }
          this.getDataPageTB();
        });
      }
    });
  }

  protected _huyCanhBao(record: DanhSachCanhBaoOutput) {
    let tt: string;
    if (record.trangThai === 'ACTIVE_ACK') {
      tt = 'CLEARED_ACK';
    } else {
      tt = 'CLEARED_UNACK';
    }
    const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
    '<p class="text-popup-xoa m-t-8">'
     +  this.l('cbtram_canhbaoseduoccapnhattrangthaila') + this.l(tt) + '</p>';
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
        const options1 = {
          timer: 1000,
        };
        this._dmTramAppService.clearCanhBao(record.idCanhBao).subscribe((rs1) => {
          if (rs1) {
            this.showSuccessMessageTimer(this.l('successconfirm', '', options1));
          } else {
            this.showWarningMessageTimer(this.l('failcancel'), '', options1);
          }
          this.getDataPageTB();
        });
      }
    });
  }

  viewDemo(event: DanhSachCanhBaoOutput) {
    this._showCreateOrEditDemoDialog(event, this.tramId, true);
  }

  gg(obj: string, mucDo: string) {
    const b = JSON.parse(obj);
    return b != null ? b[mucDo]?.color : null;
  }

  hubCanhBao() {
    this.http.get('../../../../../../assets/appconfig.json').subscribe(w => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(w['remoteServiceBaseUrl'] + '/location', { transport: signalR.HttpTransportType.ServerSentEvents })
        .build();

      this.connection.start().then(() => {
        console.log('Đã khởi động Socket tự động load cảnh báo!');
        this.connectionEstablished.next(true);
      }).catch(err => console.log(err));

      this.connection.on('GetLocation', () => {
        this.getDataPageTB();
      });
    });
  }

  hubUpdateCanhBao() {
    this.http.get('../../../../../../assets/appconfig.json').subscribe(w => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(w['remoteServiceBaseUrl'] + '/updateCanhBao', { transport: signalR.HttpTransportType.ServerSentEvents })
        .build();

      this.connection.start().then(() => {
        console.log('Đã khởi động Socket tự động load update cảnh báo!');
        this.connectionEstablished.next(true);
      }).catch(err => console.log(err));

      this.connection.on('GetUpdateCanhBao', () => {
        this.getDataPageTB();
      });
    });
  }

  private _showCreateOrEditDemoDialog(event: DanhSachCanhBaoOutput, tramId: number, isView = false): void {
    // copy
    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      XemChiTietCanhBaoComponent,
      {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          event,
          tramId,
          isView,
        },
      }
    );

    // ouput emit
    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.getDataPageTB();
    });
  }
}
