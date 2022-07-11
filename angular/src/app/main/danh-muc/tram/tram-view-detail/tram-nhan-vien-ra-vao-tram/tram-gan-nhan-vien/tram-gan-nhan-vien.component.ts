import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DMNhanVienRaVaoTramServiceProxy, GanNhanViensVaoTramInputDto, NhanVienRaVaoTramDto,
  NhanVienRaVaoTramDtoPagedResultDto, NhanVienRaVaoTramGetByTramIdOutputDto
} from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-tram-gan-nhan-vien',
  templateUrl: './tram-gan-nhan-vien.component.html',
  styleUrls: ['./tram-gan-nhan-vien.component.scss']
})
export class TramGanNhanVienComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  @ViewChild('dt') table: Table;
  idTram: number;
  tbEntityId: string;
  ganNvInput: GanNhanViensVaoTramInputDto = new GanNhanViensVaoTramInputDto();
  keyword: string;
  saving = false;
  loading = false;
  totalCount = 0;
  first = 0;
  records: NhanVienRaVaoTramDto[] = [];
  arrNhanVienChecked: NhanVienRaVaoTramDto[] = [];
  listNhanVienChecked: NhanVienRaVaoTramGetByTramIdOutputDto[] = [];

  constructor(
    injector: Injector,
    private _dMNhanVienRaVaoTramServiceProxy: DMNhanVienRaVaoTramServiceProxy,
    public bsModalRef: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save() {
    this.ganNvInput.idNhanViens = this.arrNhanVienChecked;
    this.ganNvInput.idTram = this.idTram;
    this.ganNvInput.tbEntityId = this.tbEntityId;
    this.ganNvInput.idNhanViensOld = this.listNhanVienChecked;
    this._dMNhanVienRaVaoTramServiceProxy.ganNhanVienVaoTram(this.ganNvInput).subscribe(rs => {
      if (rs === 1) {
        this.showSaveMessage();
        this.close();
        this.onSave.emit();
      } else if (rs === 2) {
        this.showErrorMessage(this.l('ThingBoard_Eror'));
      } else {
        this.showErrorMessage(this.l('ThingBoard_Eror_Admin'));
      }
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }

  getDataPage(lazyLoad?: LazyLoadEvent) {
    this._dMNhanVienRaVaoTramServiceProxy.getAll(
      this.keyword || undefined,
      this.getSortField(this.table),
      lazyLoad ? lazyLoad.first : this.first,
      lazyLoad ? lazyLoad.rows : this.table.rows,
    ).subscribe((result: NhanVienRaVaoTramDtoPagedResultDto) => {
      result.items = result.items.filter(f => !this.listNhanVienChecked
        .map(e => e.idNhanVien).includes(f.id));
      this.loading = false;
      this.records = result.items;
      this.totalCount = result.totalCount;
    });
  }
}
