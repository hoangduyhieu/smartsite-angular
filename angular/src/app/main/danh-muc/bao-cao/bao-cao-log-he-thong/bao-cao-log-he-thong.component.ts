import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import { BaoCaoLogHeThongInput, BaoCaoLogHeThongServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-bao-cao-log-he-thong',
  templateUrl: './bao-cao-log-he-thong.component.html',
  styleUrls: ['./bao-cao-log-he-thong.component.scss'],
  animations: [appModuleAnimation()],
})
export class BaoCaoLogHeThongComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  form: FormGroup;
  loading = true;
  exporting = false;
  listTram: any;
  datas: any;
  totalCount: number;
  sorting = '';
  endDate = new Date();
  startDay = new Date((new Date()).setDate((new Date()).getDate() - 4));
  rangeDates: any;
  dataTacVu: any;
  listNguoiDung: any;
  idNguoiDung: number;
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
      text: this.l('bclog_chartname'),
      fontSize: 25,
      fontStyle: 'bold'
    }
  };

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _baoCaoLogHeThongAppService: BaoCaoLogHeThongServiceProxy,
    public http: HttpClient,
    private _fileDownloadService: FileDownloadService,

  ) {
    super(injector);
  }



  ngOnInit(): void {
    this.khoiTaoForm();
    this.rangeDates = [this.startDay, this.endDate];
    this._baoCaoLogHeThongAppService.getTenNguoiDung().subscribe(s => {
      this.listNguoiDung = s;
      this.form.controls.NguoiDungCmb.setValue(this.listNguoiDung[0]);
      this.getDataPage(this.listNguoiDung[0].id);
    });
    this.options = this.options1;
  }

  khoiTaoForm() {
    this.form = new FormGroup({
      NguoiDungCmb: new FormControl(''),
      TuNgayDenNgay: new FormControl('', { validators: [Validators.required] }),
    });
  }

  timKiem() {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.getDataPage(this.form.controls.NguoiDungCmb.value.id);
      this.options = this.options1;
    }
  }
  getTablePage(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._baoCaoLogHeThongAppService.getAllTableCBaoCao(this.form.controls.NguoiDungCmb.value.id, this.rangeDates[0], this.rangeDates[1],
      this.sorting,
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows).pipe(finalize(() => { this.loading = false; }))
      .subscribe(result => {
        this.datas = result.items;
        this.totalCount = result.totalCount;
      });
  }
  getDataPage(nguoidung: number, lazyLoad?: LazyLoadEvent) {
    this.idNguoiDung = nguoidung;
    this._baoCaoLogHeThongAppService.getAllCBaoCao(nguoidung, this.rangeDates[0], this.rangeDates[1]
    ).subscribe(rs => {
      this.dataTacVu = rs;
    });
    this.loading = true;
    this._baoCaoLogHeThongAppService.getAllTableCBaoCao(nguoidung, this.rangeDates[0], this.rangeDates[1],
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
    this.form.controls.NguoiDungCmb.setValue(this.listNguoiDung[0]);
    this.getDataPage(this.listNguoiDung[0].id);
  }

  exportToExcel() {
    this.exporting = true;
    const input = new BaoCaoLogHeThongInput();
    input.tuNgay = this.rangeDates[0];
    input.denNgay = this.rangeDates[1];
    input.nguoiDung = this.idNguoiDung;
    this._baoCaoLogHeThongAppService.exportToExcel(input).subscribe((result) => {
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

