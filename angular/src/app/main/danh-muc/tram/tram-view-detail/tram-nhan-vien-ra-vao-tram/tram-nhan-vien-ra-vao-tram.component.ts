import { AppComponentBase } from '@shared/app-component-base';
import {
  DMNhanVienRaVaoTramServiceProxy,
  NhanVienRaVaoTramGetByTramIdOutputDto,
  NhanVienRaVaoTramGetByTramIdOutputDtoPagedResultDto,
  TramNhanVien,
  SetQuanLyTramInputDto

} from './../../../../../../shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { TramGanNhanVienComponent } from './tram-gan-nhan-vien/tram-gan-nhan-vien.component';
import { AppChucVuNhanVienRaVaoTram } from '@shared/AppEnums';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-tram-nhan-vien-ra-vao-tram',
  templateUrl: './tram-nhan-vien-ra-vao-tram.component.html',
  styleUrls: ['./tram-nhan-vien-ra-vao-tram.component.scss'],
  animations: [appModuleAnimation()]
})
export class TramNhanVienRaVaoTramComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  @Input() idTram: number;
  @Input() tbEntityId: string;
  nhanViens: NhanVienRaVaoTramGetByTramIdOutputDto[] = [];
  setQuanLyTramInputDto: SetQuanLyTramInputDto;
  nhanViensAfterDelete: NhanVienRaVaoTramGetByTramIdOutputDto[];
  listChucVu = [{ id: 1, displayName: 'Quản lý' }, { id: 2, displayName: 'Nhân viên' }];
  filterChucVu: any;
  nhanViensSelected: NhanVienRaVaoTramGetByTramIdOutputDto[] = [];
  tramNhanViens: TramNhanVien[] = [];
  tramNV: TramNhanVien;
  nhanVienNames: string[] = [];
  checkQlt = 0;
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  loading = true;
  totalCount = 0;
  first = 0;
  quanLyTram = false;
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dMNhanVienRaVaoTramServiceProxy: DMNhanVienRaVaoTramServiceProxy,
  ) {
    super(injector);
  }
  ngOnInit(): void {
  }

  getDataPage(lazyLoad?: LazyLoadEvent): void {
    this._dMNhanVienRaVaoTramServiceProxy.getListNvByTramId(
      this.keyword || undefined,
      this.idTram,
      this.filterChucVu?.id,
      this.getSortField(this.table),
      lazyLoad ? lazyLoad.first : this.first,
      lazyLoad ? lazyLoad.rows : this.table.rows,
    ).subscribe((result: NhanVienRaVaoTramGetByTramIdOutputDtoPagedResultDto) => {
      this.loading = false;
      this.nhanViens = result.items;
      this.totalCount = result.totalCount;
    });
  }
  deleteNhanViens() {
    this.tramNhanViens = [];
    this.nhanViensAfterDelete = [];
    this.nhanViensSelected.forEach(e => {
      this.tramNV = new TramNhanVien();
      this.tramNV.tramId = e.idTram;
      this.tramNV.nhanVienId = e.idNhanVien;
      this.tramNhanViens.push(this.tramNV);
    });
    const titleXoa = this.nhanViensSelected.length === 1 ? this.l('qlnvtram_delnhanvienswal1', this.nhanViensSelected[0].ten) : this.l('qlnvtram_delnhanvienswal');
    this.nhanViensAfterDelete = this.nhanViens.filter(f => !this.nhanViensSelected.map(e => e.idNhanVien).includes(f.idNhanVien));
    const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
    '<p class="text-popup-xoa m-t-8">'
     +  titleXoa + '</p>';
    this.swal.fire({
      html: html1,
      icon: 'warning',
      iconHtml: '<span class="icon1">&#9888</span>',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: this.confirmButtonColor,
      cancelButtonColor: this.cancelButtonColor,
      cancelButtonText: this.l(this.cancelButtonText),
      confirmButtonText: this.l(this.deleteButtonText)
    }).then((result) => {
      if (result.value) {
        this._dMNhanVienRaVaoTramServiceProxy.deleteNVKhoiTram(this.tramNhanViens,
          this.nhanViensAfterDelete, this.tbEntityId).subscribe((rs) => {
            if (rs === 1) {
              this.showDeleteMessage();
              this.getDataPage();
              this.nhanViensSelected = [];
            } else if (rs === 2) {
              this.showErrorMessage(this.l('qlnvtram_hethongtbxayraloi'));
            } else {
              this.showErrorMessage(this.l('qlnvtram_errorcontactadmin'));
            }
          });
      }
    });
  }
  syncData(): void {
    this._dMNhanVienRaVaoTramServiceProxy.getNvsRavaoTramFromThingBoard(this.tbEntityId, this.idTram).subscribe(rs => {
      if (rs === 1) {
        this.showSuccessMessage(this.l('qlnvtram_dongbothanhcong'));
        this.getDataPage();
      } else {
        this.showErrorMessage(this.l('qlnvtram_errorcontactadmin'));
      }
    });
  }
  ganNhanVienVaoTram() {
    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      TramGanNhanVienComponent,
      {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          listNhanVienChecked: this.nhanViens,
          idTram: this.idTram,
          tbEntityId: this.tbEntityId
        },
      }
    );

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.getDataPage();
    });
  }

  checkVisibleQlt(): boolean {
    return this.nhanViensSelected.filter(e => e.chucVuNumber === 2).length > 0;
  }

  ganQuanLyTram() {
    this.tramNhanViens = [];
    this.nhanViensAfterDelete = [];
    this.setQuanLyTramInputDto = new SetQuanLyTramInputDto();
    this.nhanViensSelected.forEach(w => {
      if (w.chucVuNumber === AppChucVuNhanVienRaVaoTram.NhanVien) {
        this.checkQlt++;
      }
    });

    if (this.checkQlt > 0) {
      this.quanLyTram = true;
    }
    const html1 =  '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
    '<p class="text-popup-xoa m-t-8">'
     +  this.l('qlnvtram_addnhanvientramswal') + '</p>';
    this.swal.fire({
      html: html1,
      icon: 'warning',
      iconHtml: '<span class="icon1">&#9888</span>',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: this.confirmButtonColor,
      cancelButtonColor: this.cancelButtonColor,
      cancelButtonText: this.l(this.cancelButtonText),
      confirmButtonText: this.l(this.saveButtonText)
    }).then((rs) => {
      if (rs.value) {
        this.nhanViensAfterDelete = this.nhanViens.filter(f => !this.nhanViensSelected.map(e => e.idNhanVien).includes(f.idNhanVien));
        this.setQuanLyTramInputDto.tbEntityId = this.tbEntityId;
        this.setQuanLyTramInputDto.nhanViensSet = this.nhanViensSelected;
        this.setQuanLyTramInputDto.nhanViensRemain = this.nhanViensAfterDelete;
        this._dMNhanVienRaVaoTramServiceProxy.setQuanLyTram(this.setQuanLyTramInputDto).subscribe((result) => {
          if (result === 1) {
            this.showSaveMessage();
            this.getDataPage();
            this.nhanViensSelected = [];
          } else {
            this.showErrorMessage(this.l('qlnvtram_errorcontactadmin'));
          }
        });
      }
    });
  }
}
