import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { DanhSachCanhBaoOutput, DMCanhBaoOutput,
  DMQuanLyCanhBaoServiceProxy,
  DuLieuCamBienOutputDto,
  DuLieuCamBienServiceProxy,
  LookupTableDLCBDto,
  LookupTableDto,
  LookupTableServiceProxy,
  SyncDuLieuCamBienInputDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-xem-chi-tiet-canh-bao',
  templateUrl: './xem-chi-tiet-canh-bao.component.html',
  styleUrls: ['./xem-chi-tiet-canh-bao.component.scss']
})
export class XemChiTietCanhBaoComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;
  saving = false;
  isEdit = false;
  tramId: number;
  event: DanhSachCanhBaoOutput;
  isView: boolean;
  mucDo: any;
  view = '';
  input: SyncDuLieuCamBienInputDto;
  listDuLieu: LookupTableDLCBDto[] = [];

  arrKieuDuLieu: LookupTableDto[] = [];
  demoDto: DuLieuCamBienOutputDto[] = [];

  constructor(
    injector: Injector,
    private _fb: FormBuilder,
    public http: HttpClient,
    private _lookupTableService: LookupTableServiceProxy,
    private _duLieuCamBienServiceProxy: DuLieuCamBienServiceProxy,
    private _dmQuanLyCanhBaoAppService: DMQuanLyCanhBaoServiceProxy,
    public bsModalRef: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.khoiTaoForm();
    this.getListCB();
    this.input = new SyncDuLieuCamBienInputDto();
    this.isEdit = true;
    // Sửa
    this.input.tramId = this.tramId;
    this.input.limit = 1;
    this.input.startTs = moment(this.event.thoiGianCanhBaoLong - 86400000);
    this.input.endTs = moment(this.event.thoiGianCanhBaoLong);
    forkJoin(
      this._dmQuanLyCanhBaoAppService.getLuatCanhBao(this.event.idThietBi, this.event.loaiCanhBao, this.isView),
    ).subscribe(([mucDo]) => {
      const md = JSON.parse((mucDo));
      this.mucDo = md !== null ? md[this.event.mucDo] : undefined;
      if (this.mucDo !== undefined) {
        const key = this.mucDo.condition.condition[0].key.key;
        if (this.mucDo.operatorAndOr === 1) {
          const predicate = this.mucDo.condition.condition;
          predicate.forEach(element => {
            let aa: string;
            aa = key + this.pipeOperation(element.predicate.operation) + element.predicate.value.defaultValue + ' Và ';
            this.view += aa;
          });
          this.view = this.view.substring(0, this.view.length - 4);
        } else {
          const predicateOr = this.mucDo.condition.condition[0].predicate.predicates;
          predicateOr.forEach(element1 => {
            let aa: string;
            aa = key + this.pipeOperation(element1.operation) + element1.value.defaultValue + ' Hoặc ';
            this.view += aa;
          });
          this.view = this.view.substring(0, this.view.length - 6);
        }
        this.input.keys = key;
        this._duLieuCamBienServiceProxy.syncDuLieuCamBienViewCanhBao(this.input).subscribe(w => {
          this.demoDto = w;
        });
      }
      this._setValueForEdit();
      if (this.isView) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  khoiTaoForm() {
    this.form = this._fb.group({
      txtTenCanhBao: [''],
      txtThoiGian: [''],
      txtTenTram: [''],
      txtMucDo: [''],
      txtTrangThai: [''],
    });
  }

  getListCB() {
    this._duLieuCamBienServiceProxy.getListDuLieuCBForSelectBox(this.tramId).subscribe(rs => {
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

  pipeOperation(vals: string) {
    let rs: string;
    switch (vals) {
      case 'EQUAL':
        rs = '=';
        break;
      case 'LESS':
        rs = '<';
        break;
      case 'NOT_EQUAL':
        rs = '!=';
        break;
      case 'GREATER':
        rs = '>';
        break;
      case 'GREATER_OR_EQUAL':
        rs = '>=';
        break;
      case 'LESS_OR_EQUAL':
        rs = '<=';
        break;
    }
    return rs;
  }


  private _setValueForEdit() {
    this.form.controls.txtThoiGian.setValue(this.event.thoiGianCanhBao);
    this.form.controls.txtTenCanhBao.setValue(this.event.loaiCanhBao);
    this.form.controls.txtMucDo.setValue(this.l(this.event.mucDo));
    this.form.controls.txtTrangThai.setValue(this.l(this.event.trangThai));
  }

  close() {
    this.bsModalRef.hide();
  }
}
