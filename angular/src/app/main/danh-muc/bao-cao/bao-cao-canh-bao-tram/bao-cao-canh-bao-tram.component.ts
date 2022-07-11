import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import { BaoCaoCanhBaoCacTramServiceProxy, KetQuaGuiTinNhanInput, LookupTableDto, LookupTableServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChiTietCanhBaoComponent } from './chi-tiet-canh-bao/chi-tiet-canh-bao.component';
@Component({
  selector: 'app-bao-cao-canh-bao-tram',
  templateUrl: './bao-cao-canh-bao-tram.component.html',
  styleUrls: ['./bao-cao-canh-bao-tram.component.scss'],
  animations: [appModuleAnimation()],
})
export class BaoCaoCanhBaoTramComponent extends AppComponentBase implements OnInit {
  form: FormGroup;
  exporting = false;
  loading = false;
  listTram: LookupTableDto[] = [];
  multi: any[];
  view: any[] = [700, 450];
  loaiCanhBao: string;
  inputExcel: KetQuaGuiTinNhanInput;

  // options
  legend = true;
  tuNgay: any;
  denNgay: any;
  tenTram: any;
  showLabels = true;
  animations = true;
  isDoughnut = false;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = false;
  showXAxisLabel = true;
  xAxisLabel = 'Test';
  yAxisLabel = 'Population';
  legendPosition = 'below';
  timeline = true;
  single: any[];
  labelBieuDo = new Array<string>();
  dataBieuDo = new Array<number>();

  // Group
  multiGroup: any[];
  legendTitle = '';

  // options
  pieOptions: any;
  data: any;

  litsCanhBao: any[];

  colorScheme = {
    domain: ['#FD3633', '#FEB135', '#FFF938', '#2EFE2E', '#C7C7C7']
  };

  sales: any[];

  constructor(
    injector: Injector,
    private _baoCaoKetQuaGuiNhanTinCanhBaoAppService: BaoCaoCanhBaoCacTramServiceProxy,
    private _fileDownloadService: FileDownloadService,
    private _lookupTableService: LookupTableServiceProxy,
    private _modalService: BsModalService,

  ) {
    super(injector);
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
        boxWidth: 80,
        labels: {
          fontColor: '#333',
          usePointStyle: true,
          boxWidth: 10,
          padding: 40,
        },
        position: 'bottom'
      }
    };
    this.khoiTaoForm();
    this._lookupTableService.getAllTramForLookupTable().subscribe(w => {
      this.listTram = w;
      this.form.controls.Tram.setValue(this.listTram[0]);
      this.setValueDatetime();
      this.timKiem();
    });
    this.changeThoiGian();
  }

  khoiTaoForm() {
    this.form = new FormGroup({
      keyword: new FormControl(),
      ThoiGian: new FormControl('', { validators: [Validators.required] }),
      Tram: new FormControl('', { validators: [Validators.required] }),
    });
  }

  exportToExcel() {
    this.exporting = true;
    this.inputExcel = new KetQuaGuiTinNhanInput();
    this.inputExcel.tramId = this.form.controls.Tram.value?.id,
      this.inputExcel.tuNgay = this.form.controls.ThoiGian.value[0];
    this.inputExcel.denNgay = this.form.controls.ThoiGian.value[1],
      this.inputExcel.loaiCanhBao = this.loaiCanhBao,
      this._baoCaoKetQuaGuiNhanTinCanhBaoAppService.exportToExcelDanhSachCanhBao(this.inputExcel).subscribe((result
      ) => {
        this._fileDownloadService.downloadTempFile(result);
        this.exporting = false;
      },
        error => {
          console.log(error);
        }, () => {
          this.exporting = false;
        });
  }

  timKiem() {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.loaiCanhBao = '';
      this.loading = true;
      this._baoCaoKetQuaGuiNhanTinCanhBaoAppService.getAllCanhBaoList(
        this.form.controls.Tram.value?.id,
        this.form.controls.ThoiGian.value[0],
        this.form.controls.ThoiGian.value[1],
        undefined).subscribe(w => {
          this.litsCanhBao = w[0].canhBaoList;
          this.loading = false;
        });
    }
  }

  changeThoiGian() {
    this.form.controls.ThoiGian.valueChanges.subscribe(w => {
      if (w === null || w[1] === null) {
        this.form.controls.ThoiGian.setErrors({ DenNgayIsNull: true });
      } else {
        this.form.controls.ThoiGian.setErrors(null);
      }
    });
  }

  getBieuDo(event: string) {
    this.labelBieuDo = [];
    this.dataBieuDo = [];
    this.loading = true;
    this.loaiCanhBao = event;
    this.tuNgay = this.form.controls.ThoiGian.value[0];
    this.denNgay = this.form.controls.ThoiGian.value[1];
    this.tenTram = this.form.controls.Tram.value.displayName,
      this._baoCaoKetQuaGuiNhanTinCanhBaoAppService.getAllCanhBao(
        this.form.controls.Tram.value?.id,
        this.form.controls.ThoiGian.value[0],
        this.form.controls.ThoiGian.value[1],
        event).subscribe(w => {
          this.sales = w;
          for (let i = 0; i <= w[0].bieuDo?.length; i++) {
            const labelBD = w[0].bieuDo[i]?.name + ' | ' + w[0].bieuDo[0]?.value + '%';
            if (w[0].bieuDo[i]?.name !== undefined) {
              this.labelBieuDo.push(labelBD);
            }
          }

          for (let i = 0; i <= w[0].bieuDo?.length; i++) {
            const dataBD = w[0].bieuDo[i]?.value;
            if (dataBD !== undefined) {
            this.dataBieuDo.push(dataBD);
            }
          }

          this.data = {
            labels: this.labelBieuDo,
            datasets: [
              {
                data: this.dataBieuDo,
                backgroundColor: [
                  '#2e8ae6', '#cc922f', '#8c8881', '#e6e332', '#6ca9e6',
                ],
                hoverBackgroundColor: [
                  '#185ca1', '#946412', '#615e58', '#999709', '#4e7aa6',
                ],
                animation: {
                  animateScale: true,
                  animateRotate: true
                }
              }
            ]
          };
          this.loading = false;
        });
  }

  setValueDatetime() {
    const dateF = new Date();
    const a = moment(dateF.setHours(0)).subtract(4, 'days').subtract(dateF.getMinutes(), 'minutes')
      .subtract(dateF.getSeconds(), 'seconds');
    this.form.controls.ThoiGian.setValue([a.toDate(), new Date()]);
  }
  xemchiTiet(tuNgay: string, denNgay: string, tenTram: string, loaiCanhBao: string, ten: string): void {
    // copy
    let viewChiTiet: BsModalRef;
    viewChiTiet = this._modalService.show(
      ChiTietCanhBaoComponent,
      {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          tuNgay,
          denNgay,
          tenTram,
          loaiCanhBao,
          ten,
        },
      }
    );
    viewChiTiet.content.onSave.subscribe(() => {
    });
  }
}
