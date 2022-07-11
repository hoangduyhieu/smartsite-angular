// tslint:disable
import { DuLieuCamBienOutputDto, ListGiaTriBieuDoDto, LookupTableDLCBDto, SyncDuLieuCamBienOutputDto } from './../../../../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from 'shared/app-component-base';
import { Component, OnInit, Injector, Input, ViewChild } from '@angular/core';
import { DuLieuCamBienServiceProxy, SyncDuLieuCamBienInputDto } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexMarkers, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { OnDestroy } from '@angular/core';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';

@Component({
  selector: 'app-du-lieu-cam-bien',
  templateUrl: './du-lieu-cam-bien.component.html',
  styleUrls: ['./du-lieu-cam-bien.component.scss'],
  animations: [appModuleAnimation()]
})
export class DuLieuCamBienComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  @Input() idTram: number;
  @Input() tbEntityId: string;
  form: FormGroup;
  loading = true;
  arrayNumber = [];
  validate = false;
  formatDate = 'DD/MM/YYYY HH:mm';
  records: DuLieuCamBienOutputDto[] = [];
  giaTriBieuDo: ListGiaTriBieuDoDto;
  listDuLieu: LookupTableDLCBDto[] = [];
  listLimit = [{ id: 20, displayName: 20 },
  { id: 50, displayName: 50 }, { id: 100, displayName: 100 },
  { id: 250, displayName: 250 }];
  filterDuLieu: any;
  listKey: any;
  selected: string[] = [];
  maxDateTime: any;
  tenTram: any;
  input: SyncDuLieuCamBienInputDto = new SyncDuLieuCamBienInputDto();
  exporting = false;
  inputExcel = new SyncDuLieuCamBienInputDto();

  font = 'SF Pro Display';
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;

  yaxisNhietDo: ApexYAxis;
  yaxisCongSuat: ApexYAxis;
  yaxisDienAp: ApexYAxis;
  yaxisDongTai: ApexYAxis;
  yaxisTanSo: ApexYAxis;

  series1: ApexAxisChartSeries;
  title1: ApexTitleSubtitle;
  chart1: ApexChart;

  series2: ApexAxisChartSeries;
  title2: ApexTitleSubtitle;
  chart2: ApexChart;

  series3: ApexAxisChartSeries;
  title3: ApexTitleSubtitle;
  chart3: ApexChart;

  series4: ApexAxisChartSeries;
  title4: ApexTitleSubtitle;
  chart4: ApexChart;

  series5: ApexAxisChartSeries;
  title5: ApexTitleSubtitle;
  chart5: ApexChart;

  series6: ApexAxisChartSeries;
  title6: ApexTitleSubtitle;
  chart6: ApexChart;

  series7: ApexAxisChartSeries;
  title7: ApexTitleSubtitle;
  chart7: ApexChart;

  series8: ApexAxisChartSeries;
  title8: ApexTitleSubtitle;
  chart8: ApexChart;

  series9: ApexAxisChartSeries;
  title9: ApexTitleSubtitle;
  chart9: ApexChart;

  series10: ApexAxisChartSeries;
  title10: ApexTitleSubtitle;
  chart10: ApexChart;

  constructor(
    injector: Injector,
    private _duLieuCamBienServiceProxy: DuLieuCamBienServiceProxy,
    private _fb: FormBuilder,
    private _fileDownloadService: FileDownloadService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.khoiTaoForm();
    this._duLieuCamBienServiceProxy.getListDuLieuCBForSelectBox(this.idTram).subscribe(rs => {
      this.listDuLieu = rs;
      const arrayOfValues = ['acmTempIndoor', 'acmTempOutdoor'];
      var result = rs.filter(function (e) {
        return arrayOfValues.indexOf(e.id) != -1
      })
      this.form.controls.MultiSelect.setValue(result);
    }, () => { }, () => {
      this.getListCB();
      this.setValueDatetime();
      const longDate = this.form.controls.DateTime.value[0].getTime() + 111600000;
      this.maxDateTime = new Date(longDate);
      this.getDataPage();
    });
  }

  chage() {
    const longDate = this.form.controls.DateTime.value[0].getTime() + 111600000;
    this.maxDateTime = new Date(longDate);
    if (this.form.controls.DateTime.value[1] === null || this.form.controls.DateTime.value[1] === undefined) {
      this.validate = true;
    } else {
      this.validate = false;
    }
  }
  khoiTaoForm() {
    this.form = this._fb.group({
      DateTime: ['', Validators.required],
      MultiSelect: ['', Validators.required],
      filterLimit: [20]
    });
  }

  setValueDatetime() {
    const dateF = new Date();
    const a = moment(dateF.setHours(0)).subtract(dateF.getMinutes(), 'minutes').subtract(dateF.getSeconds(), 'seconds');
    this.form.controls.DateTime.setValue([a.toDate(), new Date()]);
  }

  getListCB() {
    this._duLieuCamBienServiceProxy.getListDuLieuCBForSelectBox(this.idTram).subscribe(rs => {
      this.listDuLieu = rs;
    });
  }

  parseData(input: string): string {
    const rs = this.listDuLieu.filter(s => s.id === input).pop();
    if (rs !== undefined) {
      return rs.displayName;
    }
    return input;
  }

  getDataPage(): void {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.loading = true;
      this.input.tramId = this.idTram;
      this.selected = new Array();
      this.form.controls.MultiSelect.value?.forEach(element => {
        this.selected.push(element.id);
      });
      this.input.keys = this.selected.join(',');
      this.listKey = this.selected.join(',');
      this.input.startTs = this.form.controls.DateTime.value ? this.form.controls.DateTime.value[0] : null;
      this.input.endTs = this.form.controls.DateTime.value ? this.form.controls.DateTime.value[1] : null;
      this.input.limit = this.form.controls.filterLimit.value?.id !== undefined ? this.form.controls.filterLimit.value?.id : 20;
      this._duLieuCamBienServiceProxy.syncDuLieuCamBien(this.input).subscribe((
        result) => {
        this.loading = false;
        this.records = result.dulieuCamBien;
        this.giaTriBieuDo = result.giaTriBieuDo;
        this.tenTram = result.tenTram;
        this.initChart();
      });
    }
  }

  public initChart(): void {
  //   let sre = [{
  //     name: "lỉe 1",
  //     data: [{x: "11/18/2021 05:00", y: 47}, {x: "11/18/2021 06:00", y: 46}, {x: "11/18/2021 07:00", y: 46}]
  //   },
  //   {
  //     name: "lỉe 2",
  //     data: [{x: "11/18/2021 05:00", y: 57}, {x: "11/18/2021 06:00", y: 66}, {x: "11/18/2021 07:00", y: 86}]
  //   }
  // ];
    // debugger
    if (this.listKey.includes('acmTemp')) {
      this.series = this.giaTriBieuDo?.nhietDo;;
    }

    if (this.listKey.includes('atsPac')) {
      this.series1 = this.giaTriBieuDo?.congSuatDienAcPha;
    }
    if (this.listKey.includes('atsVacP1')) {
      this.series2 = this.giaTriBieuDo?.dienApLuoi;
    }
    if (this.listKey.includes('atsVgenP')) {
      this.series3 = this.giaTriBieuDo?.dienApMayPhat;
    }
    if (this.listKey.includes('atsVloadP')) {
      this.series4 = this.giaTriBieuDo?.dienApTai;
    }

    if (this.listKey.includes('atsIloadP')) {
      this.series5 = this.giaTriBieuDo?.dongTai;
    }

    if (this.listKey.includes('atsVacFreq') && this.listKey.includes('atsVgenFreq') && this.listKey.includes('atsVloadFreq')) {
      this.series6 = this.giaTriBieuDo?.tanSoDienAp
    }

    if (this.listKey.includes('mccDcBat')) {
      this.series7 = this.giaTriBieuDo?.nhietDoACCU;
    }

    if (this.listKey.includes('mccDcV')) {
      this.series8 = this.giaTriBieuDo?.dienApDC;
    }

    if (this.listKey.includes('mccDcI')) {
      this.series9 = this.giaTriBieuDo?.dongDienDC;
    }

    if (this.listKey.includes('mccDcP')) {
      this.series10 = this.giaTriBieuDo?.congSuatDC;
    }

    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    const fileName = '-Nhiệt độ-';
    this.chart = {
      type: 'area',
      stacked: false,
      height: 200,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName1 = '-Công suất điện AC-';
    this.chart1 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName1 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName1 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName1 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName2 = '-Điện áp lưới-';
    this.chart2 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName2 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName2 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName2 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName3 = '-Điện áp máy phát-';
    this.chart3 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName3 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName3 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName3 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName4 = '-Điện áp tải-';
    this.chart4 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName4 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName4 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName4 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName5 = '-Dòng tải-';
    this.chart5 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName5 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName5 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName5 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName6 = '-Tần số-';
    this.chart6 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName6 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName6 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName6 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName7 = '-Nhiệt độ accu-';
    this.chart7 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName7 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName7 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName7 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName8 = '-Điện áp DC-';
    this.chart8 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName8 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName8 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName8 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName9 = '-Dòng điện DC-';
    this.chart9 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName9 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName9 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName9 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    const fileName10 = '-Công suất DC-';
    this.chart10 = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          zoomin: false,
          zoomout: false,
        },
        export: {
          csv: {
            filename: this.tenTram + fileName10 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate),
            headerCategory: 'Thời gian',
            dateFormatter(timestamp) {
              return moment(new Date(timestamp)).format('DD/MM/YYYY HH:mm')
            }
          },
          svg: {
            filename: this.tenTram + fileName10 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          },
          png: {
            filename: this.tenTram + fileName10 +
              moment(this.input.startTs).format(this.formatDate) + '-' + moment(this.input.endTs).format(this.formatDate)
          }
        }
      },
      selection: {
        stroke: {
          width: 1
        }
      }
    };
    this.title = {
      text: 'Nhiệt độ',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: 'SF Pro Display',
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title1 = {
      text: 'Công suất điện AC',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title2 = {
      text: 'Điện áp lưới',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title3 = {
      text: 'Điện áp máy phát',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title4 = {
      text: 'Điện áp tải',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title5 = {
      text: 'Dòng tải',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title6 = {
      text: 'Tần số',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title7 = {
      text: 'Nhiệt độ accu',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title8 = {
      text: 'Điện áp DC',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title9 = {
      text: 'Dòng điện DC',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.title10 = {
      text: 'Công suất DC',
      align: 'center',
      style: {
        fontSize: '24px',
        fontFamily: this.font,
        fontWeight: '600',
        color: '#0A4874',
      }
    };
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxisNhietDo = {
      labels: {
        formatter(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: '°C'
      }
    };
    this.yaxisCongSuat = {
      labels: {
        formatter(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: 'W'
      }
    };
    this.yaxisDienAp = {
      labels: {
        formatter(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: 'V'
      }
    };
    this.yaxisDongTai = {
      labels: {
        formatter(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: 'A'
      }
    };
    this.yaxisTanSo = {
      labels: {
        formatter(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: 'Hz'
      }
    };
    this.xaxis = {
      type: 'datetime'
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter(val) {
          return val.toFixed(0);
        }
      },
      x: {
        show: true,
        format: 'dd/MM/yyyy-HH:mm:ss',
        formatter: undefined,
      }
    };
  }

  exportToExcel() {
    this.exporting = true;
    this.inputExcel = new SyncDuLieuCamBienInputDto();
    this.inputExcel.tramId = this.idTram;
      this.selected = new Array();
      this.form.controls.MultiSelect.value?.forEach(element => {
        this.selected.push(element.id);
      });
      this.inputExcel.keys = this.selected.join(',');
      this.listKey = this.selected.join(',');
      this.inputExcel.startTs = this.form.controls.DateTime.value ? this.form.controls.DateTime.value[0] : null;
      this.inputExcel.endTs = this.form.controls.DateTime.value ? this.form.controls.DateTime.value[1] : null;
      this.inputExcel.limit = this.form.controls.filterLimit.value?.id !== undefined ? this.form.controls.filterLimit.value?.id : 20;
      this._duLieuCamBienServiceProxy.exportToExcel(this.inputExcel).subscribe((result
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
}
