import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  BaoCaoThongTinTramServiceProxy, DataInDay,
  DemoForView, DemoGetAllInputDto, GetAllBaoCaoThongTinTramInput, LookupTableServiceProxy
} from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng';
import { Table } from 'primeng/table';
import { FileDownloadService } from '@shared/file-download.service';
import { ChartInfo } from './chartInfo';
@Component({
  selector: 'app-bao-cao-thong-tin-tram',
  templateUrl: './bao-cao-thong-tin-tram.component.html',
  styleUrls: ['./bao-cao-thong-tin-tram.component.scss'],
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class BaoCaoThongTinTramComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  form: FormGroup;
  keyword = '';
  advancedFiltersVisible = false;
  isActive = false;
  loading = false;
  exporting = false;
  demos: DemoForView[] = [];
  input: DemoGetAllInputDto;
  totalCount = 3;
  tuNgay = undefined;
  denNgay = undefined;
  rangeDates: any;
  basicData: any;
  barData: any;
  listTram: any;
  datas: DataInDay[] = [];
  filterTram: any;
  options = ChartInfo;
  nd = ChartInfo.optionsChartNhietDo;
  dal: any = {
    tooltips: {
        callbacks: {
            // tslint:disable-next-line:no-identical-functions
            label(tooltipItem, data) {
                const allData = data.datasets[tooltipItem.datasetIndex].data;
                const tooltipLabel = data.labels[tooltipItem.index];
                const tooltipData = allData[tooltipItem.index];
                return tooltipLabel + ': ' + tooltipData + ' V';
            }
        }
    },
    legend: {
        display: true,
        position: 'bottom',
        labels: {
            usePointStyle: false
        },
    },
    title: {
        display: true,
        text: this.l('bctttram_dienapluoi'),
        fontSize: 15,
        fontStyle: 'bold'
    }
};
  da = ChartInfo.optionsChartDoAm;
  mm = ChartInfo.optionsChartMoMit;
  nn = ChartInfo.optionsChartMucNuoc;
  dc = ChartInfo.optionsChartDiaChan;
  dataNhietDo: any;
  dataDienApLuoi: any;
  dataDoAm: any;
  dataMucNuoc: any;
  dataDiaChan: any;
  dataMoMit: any;
  startDay = new Date();
  endDate = new Date((new Date()).setDate((new Date()).getDate() - 4));
  maxDateTime = new Date();

  constructor(
    injector: Injector,
    private _lookupTable: LookupTableServiceProxy,
    private _baoCaoThongTinTram: BaoCaoThongTinTramServiceProxy,
    public http: HttpClient,
    private _fileDownloadService: FileDownloadService,

  ) {
    super(injector);
    this.maxDateTime.setDate(this.maxDateTime.getDate());
  }

  ngOnInit(): void {
    this.nd.title.text = this.l(this.nd.title.text);
    this.da.title.text = this.l(this.da.title.text);
    this.mm.title.text = this.l(this.mm.title.text);
    this.nn.title.text = this.l(this.nn.title.text);
    this.dc.title.text = this.l(this.dc.title.text);
    this.rangeDates = [this.endDate, this.startDay];
    this._lookupTable.getAllTramForLookupTable().subscribe(rs => {
      this.listTram = rs;
      this.filterTram = rs[0];
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
    this._baoCaoThongTinTram.getAllBaoCaoThongTinTram(this.filterTram?.id, this.rangeDates[0], this.rangeDates[1]).subscribe(rs => {
      this.loading = false;
      this.datas = rs.listDataTable;
      this.dataNhietDo = {
        labels: rs.listDay,
        datasets: [
          {
            label: this.l('bctttram_nhietdophongthietbi'),
            data: rs.listValueNhietDoPhongThietBi,
            fill: true,
            backgroundColor: '#F7918E',
            borderColor: '#ff3830',
          },
          {
            label: this.l('bctttram_nhietdobenngoaitram'),
            data: rs.listValueNhietDoNgoaiTram,
            fill: false,
            borderColor: '#FFA726',
          },
          {
            label: this.l('bctttram_nhietdobinhaccu'),
            data: rs.listValueNhietDoBinhAccu,
            fill: false,
            borderColor: '#1B9EA4',
          }
        ]
      };
      this.dataDienApLuoi = {
        labels: rs.listDay,
        datasets: [
          {
            label: this.l('bctttram_chartdienapluoi1'),
            data: rs.listValueDienAp1,
            fill: true,
            backgroundColor: '#F7918E',
            borderColor: '#ff3830',
          },
          {
            label: this.l('bctttram_chartdienapluoi2'),
            data: rs.listValueDienAp2,
            fill: false,
            borderColor: '#FFA726',
          },
          {
            label: this.l('bctttram_chartdienapluoi3'),
            data: rs.listValueDienAp3,
            fill: false,
            borderColor: '#1B9EA4',
          }
        ]
      };
      this.dataDoAm = {
        labels: rs.listDay,
        datasets: [
          {
            label: this.l('bctttram_doamphongthietbi'),
            data: rs.listValueDoAm,
            fill: true,
            backgroundColor: '#696aaa',
            borderColor: '#5e5f99'
          }
        ]
      };
      this.dataMucNuoc = {
        labels: rs.listDay,
        datasets: [
          {
            label: this.l('bctttram_mucnuoc'),
            data: rs.listValueMucNuoc,
            fill: true,
            backgroundColor: '#6DA2DD',
            borderColor: '#1b5aa4',
          }
        ]
      };
      this.dataDiaChan = {
        labels: rs.listDay,
        datasets: [
          {
            label: this.l('bctttram_dorungdiachan'),
            data: rs.listValueDiaChan,
            fill: true,
            backgroundColor: '#966B6B',
            borderColor: '#7c3737',
          }
        ]
      };
      this.dataMoMit = {
        labels: rs.listDay,
        datasets: [
          {
            label: this.l('bctttram_mucdomomit'),
            data: rs.listValueMoMit,
            fill: true,
            backgroundColor: '#5D9C77',
            borderColor: '#13743C',
          }
        ]
      };
    });
  }

  cancel() {
    this.rangeDates = [this.endDate, this.startDay];
    this.filterTram = this.listTram[0];
    this.getDataPage();
  }

  exportToExcel() {
    this.exporting = true;
    const input = new GetAllBaoCaoThongTinTramInput();
    input.tuNgay = this.rangeDates ? this.rangeDates[0] : undefined;
    input.denNgay = this.rangeDates ? this.rangeDates[1] : undefined;
    input.tramId = this.filterTram?.id;
    this._baoCaoThongTinTram.exportToExcel(input).subscribe((result) => {
      this._fileDownloadService.downloadTempFile(result);
      this.exporting = false;
    }, () => {
      this.exporting = false;
    });
  }
}
