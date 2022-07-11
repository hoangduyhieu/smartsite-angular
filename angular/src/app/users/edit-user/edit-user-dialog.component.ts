// tslint:disable
import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
  UserServiceProxy,
  UserDto,
  RoleDto,
  RoleServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonComponent } from '@shared/dft/components/common.component';

@Component({
  templateUrl: './edit-user-dialog.component.html'
})
export class EditUserDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  user = new UserDto();
  roles: RoleDto[] = [];
  listRoles: any;
  checkedRolesMap: { [key: string]: boolean } = {};
  id: number;
  isView = false;
  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;
  isRoleActive = true;
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    public _userService: UserServiceProxy,
    private _rolesService: RoleServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.khoiTaoForm();
    this._userService.getForEdit(this.id, this.isView).subscribe((result) => {
      this.user = result;
      this._setValueForEdit();
      this._userService.getRoles().subscribe((result2) => {
        this.roles = result2.items;
        this.setInitialRolesStatus();
      });
    });

    this._rolesService.checkRoles().subscribe(w => {
      this.listRoles = w;
    });
  }

  khoiTaoForm() {
    this.form = this.fb.group({
      HoTen: ['', Validators.required],
      ChucVu: [''],
      DiaChi: [''],
      EmailAddress: ['', Validators.required],
      TenDangNhap: [{ value: '', disabled: true }, Validators.required],
      SoDienThoai: [''],
      TinhTrang: [true],
      GhiChu: [''],
    });
  }

  setInitialRolesStatus(): void {
    _.map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return _.includes(this.user.roleNames, normalizedName);
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _.forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  save(): void {
    this.user.roleNames = this.getCheckedRoles();
    if (CommonComponent.getControlErr(this.form) === '') {
      this.saving = true;
      this._getValueForSave();

      this._userService.checkExist(this.user.userName, this.user.emailAddress, this.user.id).subscribe((res) => {
        switch (res) {
          case 0: {
            this._userService
              .update(this.user)
              .pipe(
                finalize(() => {
                  this.saving = false;
                })
              )
              .subscribe(() => {
                this.showUpdateMessage();
                this.bsModalRef.hide();
                this.onSave.emit();
              });
            break;
          }
          case 1: {
            this.showExistMessage(this.l('qlnguoidung_tendangnhapbitrung'));
            this.saving = false;
            break;
          }
          case 2: {
            this.showExistMessage(this.l('qlnguoidung_emailtrung'));
            this.saving = false;
            break;
          }
          default:
            break;
        }
      });
    }
  }

  private _getValueForSave() {
    this.user.name = this.form.controls.HoTen.value;
    this.user.surname = this.form.controls.HoTen.value;
    this.user.chucVu = this.form.controls.ChucVu.value;
    this.user.diaChi = this.form.controls.DiaChi.value;
    this.user.emailAddress = this.form.controls.EmailAddress.value;
    this.user.userName = this.form.controls.TenDangNhap.value;
    this.user.phoneNumber = this.form.controls.SoDienThoai.value;
    this.user.isActive = this.form.controls.TinhTrang.value;
    this.user.ghiChu = this.form.controls.GhiChu.value;
  }

  private _setValueForEdit() {
    this.form.controls.HoTen.setValue(this.user.name);
    this.form.controls.ChucVu.setValue(this.user.chucVu);
    this.form.controls.DiaChi.setValue(this.user.diaChi);
    this.form.controls.EmailAddress.setValue(this.user.emailAddress);
    this.form.controls.TenDangNhap.setValue(this.user.userName);
    this.form.controls.SoDienThoai.setValue(this.user.phoneNumber);
    this.form.controls.TinhTrang.setValue(this.user.isActive);
    this.form.controls.GhiChu.setValue(this.user.ghiChu);
    if (this.isView) {
      this.form.disable();
    }
  }
}
