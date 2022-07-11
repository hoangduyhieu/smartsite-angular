import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import { BaoCaoNhienLieuMayNoServiceProxy, BaoCaoNhienLieuMayNoTableInput, LookupTableServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-bao-cao-nhien-lieu-may-no',
  templateUrl: './bao-cao-nhien-lieu-may-no.component.html',
  styleUrls: ['./bao-cao-nhien-lieu-may-no.component.scss'],
  animations: [appModuleAnimation()],
})
export class BaoCaoNhienLieuMayNoComponent extends AppComponentBase implements OnInit {

  @ViewChild('dt') table: Table;
  form: FormGroup;
  arrDate: any;
  loading = true;
  exporting = false;
  listTram: any;
  daylist: any;
  tenTram: any;
  sorting = '';
  datas: any;
  dt: any;
  totalCount: any;
  endDate = new Date();
  startDay = new Date((new Date()).setDate((new Date()).getDate() - 4));
  rangeDates: any;
  dataNhienLieu: any;
  options: any;
  options1 = {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: false
      },
    },
    title: {
      display: true,
      text: this.l('bcnhienlieu_khoiluongnhienlieu'),
      fontSize: 25,
      fontStyle: 'bold'
    }
  };
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _baoCaoNhienLieuMayNoAppService: BaoCaoNhienLieuMayNoServiceProxy,
    private _lookupTableService: LookupTableServiceProxy,
    public http: HttpClient,
    private _fileDownloadService: FileDownloadService,

  ) {
    super(injector);
  }



  ngOnInit(): void {
    this.khoiTaoForm();
    this.rangeDates = [this.startDay, this.endDate];
    this.daylist = this.getDaysArray(this.startDay, this.endDate);
    this._lookupTableService.getAllTramForLookupTable().subscribe(s => {
      this.listTram = s;
      this.form.controls.TramCmb.setValue(this.listTram[0]);
      this.getDataPage(this.listTram[0].id);
    });
    this.options = this.options1;
    this.checkTuNgayDenNgay();
  }

  getDaysArray(start, end) {
    for (this.arrDate = [], this.dt = new Date(start); this.dt <= end; this.dt.setDate(this.dt.getDate() + 1)) {
      this.arrDate.push(new Date(this.dt.toISOString()));
    }
    return this.arrDate;
  }
  khoiTaoForm() {
    this.form = new FormGroup({
      TramCmb: new FormControl(''),
      TuNgayDenNgay: new FormControl('', { validators: [Validators.required] }),
    });
  }

  timKiem() {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.getDataPage(this.form.controls.TramCmb.value.id);
      this.daylist = this.getDaysArray(this.rangeDates[0], this.rangeDates[1]);
      this.options = this.options1;
    }
  }
  getTablePage(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._baoCaoNhienLieuMayNoAppService.getAllTableCBaoCao(this.form.controls.TramCmb.value.id, this.rangeDates[0], this.rangeDates[1],
      this.sorting,
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows).pipe(finalize(() => { this.loading = false; }))
      .subscribe(result => {
        this.datas = result.items;
        this.totalCount = result.totalCount;
      });
  }
  getDataPage(tram: number, lazyLoad?: LazyLoadEvent) {
    this.tenTram = tram;
    this._baoCaoNhienLieuMayNoAppService.getAllCBaoCao(tram, this.rangeDates[0], this.rangeDates[1]
    ).subscribe(rs => {
      this.dataNhienLieu = rs;
    });
    this.loading = true;
    this._baoCaoNhienLieuMayNoAppService.getAllTableCBaoCao(tram, this.rangeDates[0], this.rangeDates[1],
      this.sorting,
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows).pipe(finalize(() => { this.loading = false; }))
      .subscribe(result => {
        this.datas = result.items;
        this.totalCount = result.totalCount;
      });
  }
  cancel() {
    this.rangeDates = [this.startDay, this.endDate];
    this.form.controls.TramCmb.setValue(this.listTram[0]);
    this.getDataPage(this.listTram[0].id);
  }
  exportToExcel() {
    this.exporting = true;
    const input = new BaoCaoNhienLieuMayNoTableInput();
    input.tuNgay = this.rangeDates[0];
    input.denNgay = this.rangeDates[1];
    input.tramId = this.tenTram;
    this._baoCaoNhienLieuMayNoAppService.exportToExcel(input).subscribe((result) => {
      this._fileDownloadService.downloadTempFile(result);
      this.exporting = false;
    }, () => {
      this.exporting = false;
    });
  }
  checkTuNgayDenNgay() {
      if (this.form.controls.TuNgayDenNgay.value[1] === null) {
        this.form.controls.TuNgayDenNgay.setErrors({ DenNgayIsNull: true });
      } else {
        this.form.controls.TuNgayDenNgay.setErrors(null);
      }
  }
}
