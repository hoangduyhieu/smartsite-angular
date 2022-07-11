import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { GiamSatCamBienServiceProxy } from '@shared/service-proxies/service-proxies';
import { extend } from 'lodash';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';

@Component({
  selector: 'app-tram-thong-tin-cam-bien',
  templateUrl: './tram-thong-tin-cam-bien.component.html',
  styleUrls: ['./tram-thong-tin-cam-bien.component.scss'],
  animations: [appModuleAnimation()],
})
export class TramThongTinCamBienComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Input() idTram: number;
  subscription: Subscription;
  rs: any;
  av = true;
  danhSachCamBien: any;
  isView = true;
  constructor(
    injector: Injector,
    private _dieuKhienAppService: GiamSatCamBienServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this._dieuKhienAppService.getDanhSachCamBienTheoTram(this.idTram).subscribe(s => {
      this.rs = s;
      if (this.rs != null) {
        this.danhSachCamBien = this.rs.danhSachCamBien;
      }
    });
    this.subscription = interval(30000).subscribe(x => {
      this.getData();
    });
  }
  getData() {
    this._dieuKhienAppService.getDanhSachCamBienTheoTram(this.idTram).subscribe(rs => {
      this.rs = rs;
      if (this.rs != null) {
        this.danhSachCamBien = this.rs.danhSachCamBien;
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
