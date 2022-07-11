import { Component, EventEmitter, Injector, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BaoCaoChiTietCanhBaoInput, BaoCaoChiTietCanhBaoServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/file-download.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-chi-tiet-canh-bao',
  templateUrl: './chi-tiet-canh-bao.component.html',
  styleUrls: ['./chi-tiet-canh-bao.component.scss']
})
export class ChiTietCanhBaoComponent extends AppComponentBase implements AfterViewInit, OnDestroy {
  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;
  exporting = false;
  sorting = '';
  @ViewChild('dt') table: Table;
  loading = true;
  ten: string;
  tenTram: string;
  loaiCanhBao: string;
  totalCount: number;
  tuNgay: moment.Moment;
  denNgay: moment.Moment;
  chiTietCanhBao: any;
  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _baoCaoChiTietCanhBaoAppService: BaoCaoChiTietCanhBaoServiceProxy,
    private _fileDownloadService: FileDownloadService,
    public bsModalRef: BsModalRef,


  ) {
    super(injector);
  }
  ngAfterViewInit(): void {
    $('modal-container[role="dialog"]').css('z-index', '1000');
    $('bs-modal-backdrop.modal-backdrop').css('z-index', '999');
    $('aside.main-sidebar').css('z-index', '998');
  }

  // tslint:disable-next-line:no-identical-functions
  ngOnDestroy(): void {
    $('aside.main-sidebar').css('z-index', '1038');
    $('bs-modal-backdrop.modal-backdrop').css('z-index', '1040');
    $('modal-container[role="dialog"]').css('z-index', '1050');
  }

  getTablePage(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._baoCaoChiTietCanhBaoAppService.getAllDanhSachCanhBao(this.tenTram, this.loaiCanhBao, this.ten, this.tuNgay, this.denNgay,
      this.sorting,
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows).pipe(finalize(() => { this.loading = false; }))
      .subscribe(result => {
        this.chiTietCanhBao = result.items;
        this.totalCount = result.totalCount;
      });
  }
  exportToExcel() {
    this.exporting = true;
    const input = new BaoCaoChiTietCanhBaoInput();
    input.tuNgay = this.tuNgay;
    input.denNgay = this.denNgay;
    input.tenTram = this.tenTram;
    input.loaiCanhBao = this.loaiCanhBao;
    input.tenMucDo = this.ten;
    this._baoCaoChiTietCanhBaoAppService.exportToExcel(input).subscribe((result) => {
      this._fileDownloadService.downloadTempFile(result);
      this.exporting = false;
    }, () => {
      this.exporting = false;
    });
  }
  close() {
    this.bsModalRef.hide();
  }
}
