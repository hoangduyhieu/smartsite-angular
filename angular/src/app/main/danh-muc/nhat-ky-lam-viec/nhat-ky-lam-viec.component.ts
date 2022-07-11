import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { NhatKyLamViec, NhatKyLamViecServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-nhat-ky-lam-viec',
  templateUrl: './nhat-ky-lam-viec.component.html',
  styleUrls: ['./nhat-ky-lam-viec.component.scss'],
  animations: [appModuleAnimation()],
})
export class NhatKyLamViecComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  @Input() tramId: number;
  users: NhatKyLamViec[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  loading = true;
  totalCount = 0;
  first = 0;
  listDonVi: any;
  listLoaiCongViec: any = [{
    id: 1,
    displayName: 'Sự cố',
  },
  {
    id: 2,
    displayName: 'Việc thường ngày',
  },
  {
    id: 3,
    displayName: 'Sửa chữa',
  }];
  form: FormGroup;
  constructor(
    injector: Injector,
    private _userService: NhatKyLamViecServiceProxy
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.khoiTaoForm();
  }

  khoiTaoForm() {
    this.form = new FormGroup({
      keyword: new FormControl(),
      ThoiGian: new FormControl(''),
      DonVi: new FormControl(''),
      LoaiCongViec: new FormControl(''),
    });
  }

  getDataPage(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._userService
      .getAll(
        this.form.controls.keyword?.value || undefined,
        this.form.controls.LoaiCongViec.value !== null ? this.form.controls.LoaiCongViec.value.displayName : undefined,
        undefined,
        this.tramId,
        this.form.controls.ThoiGian.value !== null ? this.form.controls.ThoiGian.value[0] : undefined,
        this.form.controls.ThoiGian.value !== null ? this.form.controls.ThoiGian.value[1] : undefined,
        this.getSortField(this.table),
        lazyLoad ? lazyLoad.first : this.table.first,
        lazyLoad ? lazyLoad.rows : this.table.rows,
      ).subscribe((result) => {
        this.loading = false;
        this.users = result.items;
        this.totalCount = result.totalCount;
      });
  }
}

