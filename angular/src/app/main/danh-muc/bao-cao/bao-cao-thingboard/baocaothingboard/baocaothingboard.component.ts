import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-baocaothingboard',
  templateUrl: './baocaothingboard.component.html',
  styleUrls: ['./baocaothingboard.component.scss'],
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None
})
export class BaocaothingboardComponent extends AppComponentBase implements OnInit {
  urlSafe: SafeResourceUrl;
  constructor(
    injector: Injector,
    private _sanitizer: DomSanitizer,
    public http: HttpClient,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.http.get('../../../../../../assets/appconfig.json').subscribe(w => {
      this.urlSafe = this._sanitizer.bypassSecurityTrustResourceUrl(w['baoCaoTrend']);
    });
  }


}
