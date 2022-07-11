import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import {
  BaoCaoThongTinTramServiceProxy, BaoCaoTrangThaiKetNoiInput, BaoCaoTrangThaiKetNoiTramServiceProxy,
  DataTableTrangThaiKetNoiInDay, DemoForView, DemoGetAllInputDto, LookupTableServiceProxy
} from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-bao-cao-trang-thai-ket-noi-tram',
  templateUrl: './bao-cao-trang-thai-ket-noi-tram.component.html',
  styleUrls: ['./bao-cao-trang-thai-ket-noi-tram.component.scss'],
  animations: [appModuleAnimation()],
})
export class BaoCaoTrangThaiKetNoiTramComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  form: FormGroup;
  keyword = '';
  isActive = false;
  loading = false;
  exporting = false;
  demos: DemoForView[] = [];
  input: DemoGetAllInputDto;
  totalCount = 3;
  tuNgay = undefined;
  denNgay = undefined;
  listTram: any;
  datas: DataTableTrangThaiKetNoiInDay[] = [];
  filterTram: any;
  startDay = new Date();
  endDate = new Date((new Date()).setDate((new Date()).getDate() - 4));
  rangeDates: any;
  dataNhietDo: any;
  options: any;
  countColumn: string[] = [];
  maxDateTime = new Date();
  constructor(
    injector: Injector,
    private _lookupTable: LookupTableServiceProxy,
    private _baoCaoTrangThaiKetNoiTram: BaoCaoTrangThaiKetNoiTramServiceProxy,
    private _baoCaoThongTinTram: BaoCaoThongTinTramServiceProxy,
    public http: HttpClient,
    private _fileDownloadService: FileDownloadService,

  ) {
    super(injector);
    this.maxDateTime.setDate(this.maxDateTime.getDate());
  }

  ngOnInit(): void {
    this.rangeDates = [this.endDate, this.startDay];
    this.filterTram = undefined;
    this.options = {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: false
        },
      },
      title: {
        display: true,
        text: this.l('bctrangthai_chartname'),
        fontSize: 25,
        fontStyle: 'bold'
      }
    };
    this._lookupTable.getAllTramForLookupTable().subscribe(rs => {
      this.listTram = rs;
      this.getDataPage();
    });
  }

  timKiem() {
    if (this.rangeDates && this.rangeDates[1] !== null) {
      this.getDataPage();
    }
  }

  getDataPage(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._baoCaoTrangThaiKetNoiTram.getAllBaoCaoTrangThaiKetNoi(
      this.filterTram?.id,
      this.rangeDates[0],
      this.rangeDates[1]).subscribe(rs => {
        this.countColumn = rs.listDay;
        this.datas = rs.listData;
        this.dataNhietDo = {
          labels: rs.listDay,
          datasets: [
            {
              label: this.l('bctrangthai_binhthuong'),
              data: rs.listNormal,
              fill: false,
              backgroundColor: '#42A5F5'
            },
            {
              label: this.l('bctrangthai_cocanhbao'),
              data: rs.listAlert,
              fill: false,
              backgroundColor: '#FFA726'
            },
            {
              label: this.l('bctrangthai_matketnoi'),
              data: rs.listDisconnect,
              fill: false,
              backgroundColor: '#7f7f7f'
            }
          ]
        };
        this.loading = false;
      });
  }
  cancel() {
    this.rangeDates = [this.endDate, this.startDay];
  }

  exportToExcel() {
    this.exporting = true;
    const input = new BaoCaoTrangThaiKetNoiInput();
    input.tuNgay = this.rangeDates ? this.rangeDates[0] : undefined;
    input.denNgay = this.rangeDates ? this.rangeDates[1] : undefined;
    input.tramId = this.filterTram?.id;
    this._baoCaoTrangThaiKetNoiTram.exportToExcel(input).subscribe((result) => {
      this._fileDownloadService.downloadTempFile(result);
      this.exporting = false;
    }, () => {
      this.exporting = false;
    });
  }
}


