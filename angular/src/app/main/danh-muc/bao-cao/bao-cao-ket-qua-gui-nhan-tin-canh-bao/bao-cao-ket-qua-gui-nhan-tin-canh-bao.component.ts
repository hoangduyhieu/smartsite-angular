import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import {
  BaoCaoKetQuaGuiNhanTinCanhBaoServiceProxy, KetQuaGuiTinNhanInput,
  KetQuaGuiTinNhanOutput,
  LookupTableDto, LookupTableServiceProxy
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
@Component({
  selector: 'app-bao-cao-ket-qua-gui-nhan-tin-canh-bao',
  templateUrl: './bao-cao-ket-qua-gui-nhan-tin-canh-bao.component.html',
  styleUrls: ['./bao-cao-ket-qua-gui-nhan-tin-canh-bao.component.scss'],
  animations: [appModuleAnimation()],
})
export class BaoCaoKetQuaGuiNhanTinCanhBaoComponent extends AppComponentBase implements OnInit {
  form: FormGroup;
  exporting = false;
  data: any[];
  single: any[];
  record: KetQuaGuiTinNhanOutput[] = [];
  listNgay: any[];
  view: any[] = [700, 400];
  style = 0;
  loading = false;
  listTram: LookupTableDto[] = [];
  inputExcel: KetQuaGuiTinNhanInput;

  // options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition = 'below';
  legendTitle = '';
  colorScheme = {
    domain: ['#2EFE2E', '#FF0000']
  };

  constructor(
    injector: Injector,
    private _baoCaoKetQuaGuiNhanTinCanhBaoAppService: BaoCaoKetQuaGuiNhanTinCanhBaoServiceProxy,
    private _fileDownloadService: FileDownloadService,
    private _lookupTableService: LookupTableServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
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

  timKiem() {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.loading = true;
      this._baoCaoKetQuaGuiNhanTinCanhBaoAppService.getAllCanhBao(
        this.form.controls.Tram.value?.id,
        this.form.controls.ThoiGian.value[0],
        this.form.controls.ThoiGian.value[1],
        undefined).subscribe(w => {
          this.record = w;
          this.listNgay = w[0].ngay;
          this.style = this.listNgay.length * 120;
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

  exportToExcel() {
    this.exporting = true;
    this.inputExcel = new KetQuaGuiTinNhanInput();
    this.inputExcel.tramId = this.form.controls.Tram.value?.id,
      this.inputExcel.tuNgay = this.form.controls.ThoiGian.value[0];
    this.inputExcel.denNgay = this.form.controls.ThoiGian.value[1],
      this._baoCaoKetQuaGuiNhanTinCanhBaoAppService.exportToExcelDanhSachCanhBao(this.inputExcel).subscribe((result) => {
        this._fileDownloadService.downloadTempFile(result);
        this.exporting = false;
      }, () => {
        this.exporting = false;
      });
  }

  setValueDatetime() {
    const dateF = new Date();
    const a = moment(dateF.setHours(0)).subtract(4, 'days').subtract(dateF.getMinutes(), 'minutes')
      .subtract(dateF.getSeconds(), 'seconds');
    this.form.controls.ThoiGian.setValue([a.toDate(), new Date()]);
  }
}
