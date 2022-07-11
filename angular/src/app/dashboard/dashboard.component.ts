import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewQuanLyCanhBaoComponent } from '@app/main/danh-muc/quan-ly-canh-bao/view-detail-dm-canh-bao/view-quan-ly-canh-bao/view-quan-ly-canh-bao.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CanhBaoPieChartTabView, CountCanhBaoNow, DashboardServiceProxy, DMCanhBaoOutput,
  DMQuanLyCanhBaoServiceProxy, MauDuLieuCamBienDto, TabViewCanhBao
} from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, Table } from 'primeng';
import { interval, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent extends AppComponentBase implements OnInit {
  data: any;
  basicData: any;
  pieOptions: any;
  dataDetail: any;
  subscription: Subscription;

  @ViewChild('dt') table: Table;
  keyword = '';
  loading = true;

  // Bên Server
  value: MauDuLieuCamBienDto[] = [];
  totalCount = 0;
  dataBox = new CountCanhBaoNow();
  thietBiList: DMCanhBaoOutput[] = [];
  canhBaoList: TabViewCanhBao[] = [];
  output: CanhBaoPieChartTabView;
  listNhietDo: TabViewCanhBao[] = [];
  listDoAm: TabViewCanhBao[] = [];
  listDienAp: TabViewCanhBao[] = [];
  listDongDien: TabViewCanhBao[] = [];
  listChay: TabViewCanhBao[] = [];
  listKhoi: TabViewCanhBao[] = [];
  listChuyenDong: TabViewCanhBao[] = [];
  listCua: TabViewCanhBao[] = [];
  listNhienLieu: TabViewCanhBao[] = [];
  listNgapNuoc: TabViewCanhBao[] = [];
  listGocNghiengAngten: TabViewCanhBao[] = [];
  listMatTinHieu: TabViewCanhBao[] = [];
  listKhac: TabViewCanhBao[] = [];
  lineOptions: any;

  mucdo: string;

  constructor(
    injector: Injector,
    private _dmQuanLyCanhBaoAppService: DMQuanLyCanhBaoServiceProxy,
    private _dashboard: DashboardServiceProxy,
    private _modalService: BsModalService,
  ) {
    super(injector);
    this.subscription = interval(3000000).subscribe(x => {
      this.search(this.mucdo);
    });
  }

  ngOnInit(): void {
    this.pieOptions = {
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            return data.labels[tooltipItem.index];
          },
        }
      },
      legend: {
        display: true,
        labels: {
          fontColor: '#333',
          usePointStyle: true,
        },
        position: 'right'
      }
    };
    this.lineOptions = {
      legend: {
        display: true,
        position: 'bottom'
      },
    };
    this.search(this.mucdo);
  }
  search(mucdo: string) {
    this.mucdo = mucdo;
    this.getDataPageDB();
    this.getDataPageTV();
  }
  getDataPageDB() {
    this._dashboard.getAllInDashboard(this.mucdo).subscribe(rs => {
      // Get data Line chart and Data box
      this.dataBox = rs.sumCanhBao;
      this.basicData = {
        labels: rs.listHour,
        datasets: [
          {
            label: this.l('BC_CRITICAL'),
            data: rs.critialInHour,
            fill: true,
            backgroundColor: '#F9D2D5',
            borderColor: '#D91F2C',
          },
          {
            label: this.l('BC_MAJOR'),
            data: rs.majorInHour,
            fill: false,
            borderColor: '#5123D3',
          },
          {
            label: this.l('BC_MINOR'),
            data: rs.minorInHour,
            fill: false,
            borderColor: '#ba9b68',
          },
          {
            label: this.l('BC_WARNING'),
            data: rs.warningInHour,
            fill: false,
            borderColor: '#FFB700',
          },
          {
            label: this.l('BC_INDETERMINATE'),
            data: rs.indeterminateInHour,
            fill: false,
            borderColor: '#53595F',
          }
        ]
      };
    });
  }
  getDataPageTV() {
    this.loading = true;
    this._dashboard.getAllPieChartTabView(this.mucdo)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(rs => {
        // Get data Pie chart and TabView
        this.canhBaoList = rs.listAll;
        this.output = rs;
        this.listNhietDo = rs.listNhietDo;
        this.listDoAm = rs.listDoAm;
        this.listDienAp = rs.listDienAp;
        this.listDongDien = rs.listDongDien;
        this.listChay = rs.listChay;
        this.listKhoi = rs.listKhoi;
        this.listChuyenDong = rs.listChuyenDong;
        this.listCua = rs.listCua;
        this.listNhienLieu = rs.listNhienLieu;
        this.listNgapNuoc = rs.listNgapNuoc;
        this.listGocNghiengAngten = rs.listGocNghiengAnten;
        this.listMatTinHieu = rs.listMatTinHieu;
        this.listKhac = rs.listKhac;
        this.data = {
          labels: [this.l('Dashboard_MienBac') + ' | ' + rs.mienBac + '%',
          this.l('Dashboard_MienTrung') + ' | ' + rs.mienTrung + '%',
          this.l('Dashboard_MienNam') + ' | ' + rs.mienNam + '%'],
          datasets: [
            {
              data: [rs.mienBac, rs.mienTrung, rs.mienNam],
              backgroundColor: [
                '#D91F2C',
                '#F2B10D',
                '#237BD3',
              ],
              hoverBackgroundColor: [
                '#e00717',
                '#DF7401',
                '#0040FF',
              ],
              animation: {
                animateScale: true,
                animateRotate: true
              }
            }
          ]
        };
        this.dataDetail = {
          labels: [this.l('Dashboard_NhietDo') + ' | ' + rs.dataPieChartDetail[0] + '%',
          this.l('Dashboard_DoAm') + ' | ' + rs.dataPieChartDetail[1] + '%',
          this.l('Dashboard_DienAp') + ' | ' + rs.dataPieChartDetail[2] + '%',
          this.l('Dashboard_DongDien') + ' | ' + rs.dataPieChartDetail[3] + '%',
          this.l('Dashboard_Chay') + ' | ' + rs.dataPieChartDetail[4] + '%',
          this.l('Dashboard_Khoi') + ' | ' + rs.dataPieChartDetail[5] + '%',
          this.l('Dashboard_ChuyenDong') + ' | ' + rs.dataPieChartDetail[6] + '%',
          this.l('Dashboard_Cua') + ' | ' + rs.dataPieChartDetail[7] + '%',
          // this.l('Dashboard_NhienLieu') + ' | ' + rs.dataPieChartDetail[8] + '%',
          this.l('Dashboard_NgapNuoc') + ' | ' + rs.dataPieChartDetail[8] + '%',
          // this.l('Dashboard_GocNghiengAnten') + ' | ' + rs.dataPieChartDetail[10] + '%',
          this.l('Dashboard_MatKetNoi') + ' | ' + rs.dataPieChartDetail[9] + '%'],
          datasets: [
            {
              data: rs.dataPieChartDetail,
              backgroundColor: [
                '#97BB06',
                '#237BD3',
                '#FFB700',
                '#5123D3',
                '#D91F2C',
                '#CDD6D0',
                '#D91FD2',
                '#B26509',
                // '#39BF9F ',
                '#23A9D3',
                // '#0A4874',
                '#53595F'
              ],
              hoverBackgroundColor: [
                '#c0ed09',
                '#0040FF',
                '#fcc12b',
                '#3e0ad1',
                '#e00717',
                '#e6ede8',
                '#cf0ac7',
                '#f0880c',
                // '#57debe',
                '#05bcf5',
                // '#409bdb',
                '#798999'
              ],
              animation: {
                animateScale: true,
                animateRotate: true
              }
            }]
        };
      });
  }

  gg(obj: string, mucDo: string) {
    const b = JSON.parse(obj);
    try {
      return b != null ? b[mucDo].color : null;
    } catch (e) {
      return null;
    }
  }

  viewDemo(event: TabViewCanhBao) {
    this._showCreateOrEditDemoDialog(event, true);
  }

  private _showCreateOrEditDemoDialog(event: TabViewCanhBao, isView = false): void {
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
      this.getDataPageDB();
      this.getDataPageTV();
    });
  }
}
