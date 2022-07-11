import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { DemoDto, DemoForView, DemoGetAllInputDto, DemoServiceProxy, DMTramServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { FileDownloadService } from '@shared/file-download.service';
import { multi } from './data';
import { single } from './single';
import { multiGroup } from './multiGroup';
import { pipe } from './pipe';
@Component({
  selector: 'app-demochart-ngx',
  templateUrl: './demochart-ngx.component.html',
  styleUrls: ['./demochart-ngx.component.scss'],
  animations: [appModuleAnimation()],
})
export class DemoChartNgXComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  form: FormGroup;
  keyword = '';
  advancedFiltersVisible = false;
  isActive = false;
  loading = true;
  exporting = false;
  demos: DemoForView[] = [];
  input: DemoGetAllInputDto;
  totalCount = 0;
  config = {
    animated: false
  };
  tuNgay = undefined;
  denNgay = undefined;
  thietBiList = [];
  frozenCols: any[];
  scrollableCols: any[];

  multi: any[];
  view: any[] = [800, 400];

  // options
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = false;
  showXAxisLabel = true;
  xAxisLabel = 'Test';
  yAxisLabel = 'Population';
  timeline = true;
  single: any[];

  // Group
  multiGroup: any[];
  legendTitle = 'Ghi chú';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  // pipe
  pipe: any[];
  colorSchemePipe = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;

  colorScheme1 = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dmTramAppService: DMTramServiceProxy,
    public http: HttpClient,
    private _fileDownloadService: FileDownloadService,

  ) { super(injector);
    Object.assign(this, { multi });
    Object.assign(this, { single });
    Object.assign(this, { multiGroup });
    Object.assign(this, { pipe });
  }

  ngOnInit(): void {
    this.khoiTaoForm();
  }

  khoiTaoForm() {
    this.form = new FormGroup({
      keyword: new FormControl(),
      ThoiGian: new FormControl(),
    });

    this.scrollableCols = [
      { field: 'mucDo', header: 'Phân vùng                                       ', style: '250px' },
      { field: 'trangThai', header: 'Độ ẩm phòng thiết bị(rh)', style: '200px' },
      { field: 'trangThai', header: 'Nhiệt độ phòng thiết bị(°C)', style: '200px' },
      { field: 'trangThai', header: 'Nhiệt độ bên ngoài trạm(°C)', style: '200px' },
      { field: 'trangThai', header: 'Dòng điện AC lưới(A)', style: '200px' },
      { field: 'trangThai', header: 'Điên áp AC lưới(V)', style: '200px' },
      { field: 'trangThai', header: 'Dòng điện DC Accu(A)', style: '200px' },
      { field: 'trangThai', header: 'Điên áp AC Accu(V)', style: '200px' },
      { field: 'trangThai', header: 'Nhiệt độ bình Accu(°C)', style: '200px' },
      { field: 'trangThai', header: 'Điện áp AC máy phát(V)', style: '200px' },
      { field: 'trangThai', header: 'Mực nước(Cm)', style: '200px' },
      { field: 'trangThai', header: 'Mức độ mờ mịt(obs/m)', style: '200px' },
      { field: 'trangThai', header: 'Trạng thái cửa(Đóng/Mở)', style: '200px' },
      { field: 'trangThai', header: 'Độ rung địa chấn', style: '200px' },
    ];
    this.frozenCols = [
      { field: 'thoiGianCanhBao', header: 'Thời gian                          ', style: '200px' },
      { field: 'loaiCanhBao', header: 'Mã trạm                 ', style: '150px' },
      { field: 'loaiCanhBao', header: 'Tên trạm                 ', style: '150px' },
    ];
  }

  timKiem() {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.getDataPage();
    }
  }

  getDataPage(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._dmTramAppService.getAllDanhSachCanhBao(
      undefined,
      undefined,
      28,
      this.form.controls.ThoiGian.value ? this.form.controls.ThoiGian.value[0] : null,
      this.form.controls.ThoiGian.value ? this.form.controls.ThoiGian.value[1] : null,
      this.getSortField(this.table),
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows,
    ).pipe(finalize(() => { this.loading = false; }))
      .subscribe(result => {
        this.thietBiList = result.items;
        this.totalCount = result.totalCount;
      });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
