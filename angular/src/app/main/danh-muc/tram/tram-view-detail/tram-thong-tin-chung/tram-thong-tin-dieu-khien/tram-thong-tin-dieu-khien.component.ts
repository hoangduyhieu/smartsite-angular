// tslint:disable
import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DanhSachThietBiDieuKhienTheoNhom, InputDieuKhienThietBi, ListNhomThietBi, ListThietBiDieuKhien,
  ThietBi, ThietBiDieuKhienDto, TramDieuKhienServiceProxy
} from '@shared/service-proxies/service-proxies';
import { ConfirmationService, MenuItem, SelectItem } from 'primeng';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-tram-thong-tin-dieu-khien',
  templateUrl: './tram-thong-tin-dieu-khien.component.html',
  styleUrls: ['./tram-thong-tin-dieu-khien.component.scss'],
  animations: [appModuleAnimation()],
  providers: [ConfirmationService],

})
export class TramThongTinDieuKhienComponent extends AppComponentBase implements OnInit {
  danhSachDieuKhien: DanhSachThietBiDieuKhienTheoNhom;
  listThietBi: ListNhomThietBi[] = [];
  listTG: ListNhomThietBi[] = [];
  selectedCategory: any = null;
  checked: any;
  huy = 'Hủy';
  ok = 'Đồng ý';
  err = 'Thất bại!';
  @Input() idTram: number;
  levels: SelectItem[];
  blockedDocument = false;
  loading = true;
  thietBi: any;
  thietBiDieuKhien: any;
  items: MenuItem[];
  status = false;
  show = true;
  switchStatus = false;
  selectedATS: ListThietBiDieuKhien;

  constructor(
    injector: Injector,
    private _tramDieuKhienService: TramDieuKhienServiceProxy,
    private _confirmationService: ConfirmationService,
    private _cd: ChangeDetectorRef,
  ) {
    super(injector);
    this.danhSachDieuKhien = new DanhSachThietBiDieuKhienTheoNhom();
    this.danhSachDieuKhien.listGroup = [];
  }
  ngOnInit(): void {
    this.levels = [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' }
    ];
    this.getDataPage();
    setInterval(() => {
      this.getDataPage();
    }, 30000);
  }

  reload() {
    this.show = false;
    this.listThietBi = this.listTG;
    this.selectedCategory = this.selectedATS;
    setTimeout(() => this.show = true);
  }

  getDataPage() {
    this.loading = true;
    this._tramDieuKhienService.getDanhSachDieuKhienTheoTram(this.idTram)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(s => {
        console.log('Trạm điều khiển', s);
        this.listThietBi = s.listGroup;
        this.listTG = s.listGroup;
        const a = s.listGroup.find(e => e.tenNhom.toLowerCase().includes('ats'))?.listThietBi.find(e => e.status === true);
        if (a !== undefined) {
          this.selectedCategory = a;
          this.selectedATS = a;
        }
      });
  }
  batTatATS(category: any) {
    if (category !== undefined) {
      this.selectedATS = category;
      this.thietBi = category;
    } else {
      this.selectedATS = this.selectedCategory;
      this.thietBi = this.selectedCategory;
    }
    const input = new InputDieuKhienThietBi();
    input.input = this.thietBi;
    input.list = this.listThietBi;
    const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
      '<p class="text-popup-xoa m-t-8">' + this.thietBi.lableControl + ' ' + this.thietBi.ten + '</p>';

    this.swal.fire({
      html: html1,
      icon: 'warning',
      iconHtml: '<span class="icon1">&#9888</span>',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: this.confirmButtonColor,
      cancelButtonColor: this.cancelButtonColor,
      cancelButtonText: this.l(this.cancelButtonText),
      confirmButtonText: this.l(this.confirmButtonText)
    }).then((rs) => {
      if (rs.value) {
        this._tramDieuKhienService.batTatThietBi(input).subscribe((result1) => {
          if (result1.length > 0) {
            // Thành công
            this.listThietBi = result1;
            this.listTG = result1;
            const a = result1.find(e => e.tenNhom.toLowerCase().includes('ats'))?.listThietBi.find(e => e.status === true);
            if (a !== undefined) {
              this.selectedCategory = a;
              this.selectedATS = a;
            }
            let timerInterval;
            this.swal.fire({
              title: 'Vui lòng đợi trong ít phút!',
              html: 'Đang xử lý <strong></strong> giây.',
              icon: 'warning',
              iconHtml: '<span class="icon1">&#9888</span>',
              timer: 30000,
              showLoaderOnConfirm: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              onOpen: () => {
                this.swal.showLoading();
                timerInterval = setInterval(() => {
                  this.swal.getContent().querySelector('strong').textContent = Math.ceil(this.swal.getTimerLeft() / 1000);
                }, 100);
              },
              onClose: () => {
                clearInterval(timerInterval);
              },
            }).then((rs1) => {
              if (
                // Read more about handling dismissals
                rs1.dismiss === this.swal.DismissReason.timer
              ) {
                this.getDataPage();
              }
            });
          } else {
            this.notify.error(this.err);
            this.thietBiDieuKhien = '';
          }
        });
      }
      else {
        this.getDataPage();
      }
    });
  }

  batTat(thietBi: ListThietBiDieuKhien) {
    console.log(thietBi);
    this.thietBiDieuKhien = thietBi.rangeId;
    const input = new InputDieuKhienThietBi();
    input.input = thietBi;
    input.list = this.listThietBi;
    input.idTram = this.idTram;
    const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +

      '<p class="text-popup-xoa m-t-8">' + thietBi.lableControl +
      ' ' + thietBi.ten + '</p>';
    this.swal.fire({
      html: html1,
      icon: 'warning',
      iconHtml: '<span class="icon1">&#9888</span>',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: this.confirmButtonColor,
      cancelButtonColor: this.cancelButtonColor,
      cancelButtonText: this.l(this.cancelButtonText),
      confirmButtonText: this.l(this.confirmButtonText)
    }).then((rs) => {
      if (rs.value) {
        this._tramDieuKhienService.batTatThietBi(input).subscribe((result) => {
          if (result.length > 0) {
            // Thành công
            this.listThietBi = result;
            this.listTG = result;
            const a = result.find(e => e.tenNhom.toLowerCase().includes('ats'))?.listThietBi.find(e => e.status === true);
            if (a !== undefined) {
              this.selectedCategory = a;
              this.selectedATS = a;
            }
            this.thietBiDieuKhien = '';

            let timerInterval
            this.swal.fire({
              title: 'Vui lòng đợi trong ít phút!',
              html: 'Đang xử lý <b></b> giây.',
              icon: 'warning',
              iconHtml: '<span class="icon1">&#9888</span>',
              timer: 30000,
              showLoaderOnConfirm: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              onOpen: () => {
                this.swal.showLoading();
                timerInterval = setInterval(() => {
                  this.swal.getHtmlContainer().querySelector('b').textContent = Math.ceil(this.swal.getTimerLeft() / 1000);
                }, 100);
              },
              onClose: () => {
                clearInterval(timerInterval);
              },
            }).then((rs1) => {
              if (
                // Read more about handling dismissals
                rs1.dismiss === this.swal.DismissReason.timer
              ) {
                // this.notify.success('Thành công!');
                this.getDataPage();
              }
            });
          } else {
            this.notify.error(this.err);
            this.thietBiDieuKhien = '';
          }
        });
      }
      else {
        this.getDataPage();
      }
    });
  }
}
