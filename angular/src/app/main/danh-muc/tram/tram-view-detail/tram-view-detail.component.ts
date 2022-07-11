import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditDanhMucTramDto, DMTramServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng';

@Component({
  selector: 'app-tram-view-detail',
  templateUrl: './tram-view-detail.component.html',
  styleUrls: ['./tram-view-detail.component.scss'],
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class TramViewDetailComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  @Output() onSave = new EventEmitter();
  tramId: number;
  tbEntityId: string;
  selectedTab: number;
  config = {
    animated: false
  };
  form: FormGroup;
  input: CreateOrEditDanhMucTramDto;

  constructor(
    injector: Injector,
    public http: HttpClient,
    private _dmTramAppService: DMTramServiceProxy,
    private _router: Router,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,

  ) { super(injector); }

  ngOnInit(): void {
    this._route.params.subscribe(item => {
      this.tramId = Number(item['idTram']);
      this.tbEntityId = String(item['tbEntityId']);
      this.selectedTab = Number(item['tab']);
    });
    this._dmTramAppService.getForEdit(this.tramId, false).subscribe(item => {
      this.input = item;
    });
  }
  close() {
  }
  activeTab(event) {
    this._router.navigate(['/app/main/danh-muc/tram/tram-view-detail', this.tramId, this.tbEntityId, event.index]);
  }
}
