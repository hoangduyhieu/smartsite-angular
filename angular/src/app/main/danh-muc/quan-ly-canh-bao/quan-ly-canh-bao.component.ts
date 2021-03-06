/* tslint:disable */
import { HttpClient } from '@angular/common/http';
import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as signalR from '@aspnet/signalr';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import { DanhSachCanhBaoOutput, DMCanhBaoInput, DMCanhBaoOutput, DMQuanLyCanhBaoServiceProxy, LookupTableDto, LookupTableServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin, interval, Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { finalize } from 'rxjs/operators';
import { ViewQuanLyCanhBaoComponent } from './view-detail-dm-canh-bao/view-quan-ly-canh-bao/view-quan-ly-canh-bao.component';

@Component({
  selector: 'app-quan-ly-canh-bao',
  templateUrl: './quan-ly-canh-bao.component.html',
  styleUrls: ['./quan-ly-canh-bao.component.scss'],
  animations: [appModuleAnimation()],
})
export class QuanLyCanhBaoComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  subscription: Subscription;
  form: FormGroup;
  advancedFiltersVisible = false;
  isActive = false;
  loading = true;
  exporting = false;
  thietBiList: DMCanhBaoOutput[];
  listLoaiCanhBao: LookupTableDto[] = [];
  listTrangThaiCanhBao1 = [
    { id: 1, displayName: this.l('ACTIVE') },
    { id: 2, displayName: this.l('ACK') },
    { id: 3, displayName: this.l('CLEARED') },
    { id: 4, displayName: this.l('UNACK') },
  ];
  listTram: LookupTableDto[] = [];
  listTrangThaiCanhBao: LookupTableDto[] = [];
  listMucDoCanhBao: LookupTableDto[] = [];
  inputExcel: DMCanhBaoInput;
  connection: signalR.HubConnection;
  connectionEstablished = new Subject<boolean>();
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
    private _dmQuanLyCanhBaoAppService: DMQuanLyCanhBaoServiceProxy,
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
      this._lookupTableService.getAllTrangThaiCanhBao(),
      this._lookupTableService.getAllTramForLookupTable(),
    ).subscribe(([loaiCanhBao, trangThaiCanhBao, listTram]) => {
      this.listLoaiCanhBao = loaiCanhBao;
      this.listTrangThaiCanhBao = trangThaiCanhBao;
      this.listTram = listTram;
    });
  }

  khoiTaoForm() {
    this.form = new FormGroup({
      keyword: new FormControl(),
      Tram: new FormControl(),
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
    this._dmQuanLyCanhBaoAppService.getAllDanhSachCanhBao(
      this.pipeSearch(this.form.controls.keyword.value) || undefined,
      this.form.controls.TrangThai.value?.id || undefined,
      this.form.controls.Tram.value?.id || undefined,
      this.form.controls.ThoiGianTu.value ? this.form.controls.ThoiGianTu.value[0] : null,
      this.form.controls.ThoiGianTu.value ? this.form.controls.ThoiGianTu.value[1] : null,
    ).pipe(finalize(() => { this.loading = false; }))
      .subscribe(result => {
        this.thietBiList = result;
      });
  }

  exportToExcel() {
    this.exporting = true;
    this.inputExcel = new DMCanhBaoInput();
    this.inputExcel.keyWord = this.form.controls.keyword.value || undefined;
    this.inputExcel.trangThai = this.form.controls.TrangThai.value?.id || undefined;
    this.inputExcel.tramId = this.form.controls.Tram.value?.id || undefined;
    this.inputExcel.tuNgay = this.form.controls.ThoiGianTu.value ? this.form.controls.ThoiGianTu.value[0] : null;
    this.inputExcel.denNgay = this.form.controls.ThoiGianTu.value ? this.form.controls.ThoiGianTu.value[1] : null,
      this._dmQuanLyCanhBaoAppService.exportToExcelDanhSachCanhBao(this.inputExcel).subscribe((result) => {
        this._fileDownloadService.downloadTempFile(result);
        this.exporting = false;
      }, () => {
        this.exporting = false;
      });
  }

  protected _xacNhan(record: DMCanhBaoOutput) {
    let tt: string;
    if (record.trangThai === 'ACTIVE_UNACK') {
      tt = 'ACTIVE_ACK';
    } else {
      tt = 'CLEARED_ACK';
    }
    const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
      '<p class="text-popup-xoa m-t-8">'
      + this.l('cbtram_canhbaoseduoccapnhattrangthaila') + this.l(tt) + '</p>';
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
          timer: 10000,
          background: '#888081',
        };
        this._dmQuanLyCanhBaoAppService.xacNhanCanhBao(record.idCanhBao).subscribe((rs) => {
          if (rs) {
            this.showSuccessMessageTimer(this.l('successconfirm', options1));
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
    const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
      '<p class="text-popup-xoa m-t-8">'
      + this.l('cbtram_canhbaoseduoccapnhattrangthaila') + this.l(tt) + '</p>';
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
        this._dmQuanLyCanhBaoAppService.clearCanhBao(record.idCanhBao).subscribe((rs1) => {
          if (rs1) {
            this.showSuccessMessageTimer(this.l('successconfirm', options1));
          } else {
            this.showWarningMessageTimer(this.l('failcancel'), '', options1);
          }
          this.getDataPageTB();
        });
      }
    });
  }

  viewDemo(event: DanhSachCanhBaoOutput) {
    this._showCreateOrEditDemoDialog(event, true);
  }

  private _showCreateOrEditDemoDialog(event: DanhSachCanhBaoOutput, isView = false): void {
    // copy
    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      ViewQuanLyCanhBaoComponent,
      {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          event,
          isView,
        },
      }
    );

    // ouput emit
    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.getDataPageTB();
    });
  }


  gg(obj: string, mucDo: string) {
    const b = JSON.parse(obj);
    return b != null ? b[mucDo]?.color : null;
  }

  hubCanhBao() {
    this.http.get('../../../../assets/appconfig.json').subscribe(w => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(w['remoteServiceBaseUrl'] + '/location', { transport: signalR.HttpTransportType.ServerSentEvents })
        .build();

      this.connection.start().then(() => {
        console.log('???? kh???i ?????ng Socket t??? ?????ng load c???nh b??o!');
        this.connectionEstablished.next(true);
      }).catch(err => console.log(err));

      this.connection.on('GetLocation', () => {
        this.getDataPageTB();
      });
    });
  }

  hubUpdateCanhBao() {
    this.http.get('../../../../assets/appconfig.json').subscribe(w => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(w['remoteServiceBaseUrl'] + '/updateCanhBao', { transport: signalR.HttpTransportType.ServerSentEvents })
        .build();

      this.connection.start().then(() => {
        console.log('???? kh???i ?????ng Socket t??? ?????ng load update c???nh b??o!');
        this.connectionEstablished.next(true);
      }).catch(err => console.log(err));

      this.connection.on('GetUpdateCanhBao', () => {
        this.getDataPageTB();
      });
    });
  }
}

