import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { FileDownloadService } from '@shared/file-download.service';
import {
  BaoCaoDanhSachTramInput, BaoCaoDanhSachVaMaCacTramServiceProxy,
  DMTramServiceProxy
} from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, Table } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-bao-cao-danh-sach-va-ma-cac-tram',
  templateUrl: './bao-cao-danh-sach-va-ma-cac-tram.component.html',
  styleUrls: ['./bao-cao-danh-sach-va-ma-cac-tram.component.scss'],
  animations: [appModuleAnimation()],
})
export class BaoCaoDanhSachVaMaCacTramComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  isActive = false;
  loading = true;
  exporting = false;
  totalCount = 0;
  listVung: any[] = [];
  datas: any[] = [];
  filterPhanVung: any;
  rangeDates: any;
  dataNhietDo: any;
  options: any;
  countColumn: string[] = [];
  sorting = '';
  maxDateTime = new Date();
  form: FormGroup;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _fileDownloadService: FileDownloadService,
    private _baoCaoDanhSachTram: BaoCaoDanhSachVaMaCacTramServiceProxy,
    private _dmTramAppService: DMTramServiceProxy,
  ) {
    super(injector);
    this.maxDateTime.setDate(this.maxDateTime.getDate());
  }

  ngOnInit(): void {
    this.khoiTaoForm();
    this.rangeDates = [undefined, undefined];
    this._dmTramAppService.getAllPhanVungTree(undefined).subscribe(rs => {
      this.listVung = this.getTreeviewItem(rs);
      this.filterPhanVung = this.getTreeviewItem(rs) ? this.getTreeviewItem(rs)[0]?.value : undefined;
    });
  }

  khoiTaoForm() {
    this.form = new FormGroup({
      keyword: new FormControl(),
      ThoiGian: new FormControl(''),
    });
  }

  timKiem() {
      this.getDataPage();
  }

  huy() {
    this.rangeDates = [undefined, undefined];
    this._dmTramAppService.getAllPhanVungTree(undefined).subscribe(rs => {
      this.listVung = this.getTreeviewItem(rs);
      this.filterPhanVung = this.getTreeviewItem(rs) ? this.getTreeviewItem(rs)[0]?.value : undefined;
      this.getDataPage(undefined, this.filterPhanVung);
    });
  }

  getDataTable(lazyLoad?: LazyLoadEvent) {
    this._dmTramAppService.getAllPhanVungTree(undefined).subscribe(rs => {
      const a = this.getTreeviewItem(rs)[0]?.value;
      this.getDataPage(lazyLoad, a);
    });
  }

  getDataPage(lazyLoad?: LazyLoadEvent, phanVungId?: number) {
    this.loading = true;
    this._baoCaoDanhSachTram.getAllBaoCaoDanhSachVaMaCacTram(
      this.filterPhanVung ? this.filterPhanVung : phanVungId,
      this.form.controls.ThoiGian.value !== null ? this.form.controls.ThoiGian.value[0] : undefined,
      this.form.controls.ThoiGian.value !== null ? this.form.controls.ThoiGian.value[1] : undefined,
      this.sorting,
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows).pipe(finalize(() => {
        this.loading = false;
      })).subscribe(rs => {
        this.datas = rs.items;
        this.totalCount = rs.totalCount;
      });
  }

  exportToExcel() {
    this.exporting = true;
    const input = new BaoCaoDanhSachTramInput();
    input.tuNgay = this.form.controls.ThoiGian.value !== null ? this.form.controls.ThoiGian.value[0] : undefined;
    input.denNgay = this.form.controls.ThoiGian.value !== null ? this.form.controls.ThoiGian.value[1] : undefined;
    input.phanVungId = this.filterPhanVung;
    input.maxResultCount = 1000000;
    this._baoCaoDanhSachTram.exportToExcel(input).subscribe((result) => {
      this._fileDownloadService.downloadTempFile(result);
      this.exporting = false;
    }, () => {
      this.exporting = false;
    });
  }
}
