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
  CreateUserDto,
  RoleDto,
  RoleServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonComponent } from '@shared/dft/components/common.component';

@Component({
  templateUrl: './create-user-dialog.component.html'
})
export class CreateUserDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  user: CreateUserDto = new CreateUserDto();
  roles: RoleDto[] = [];
  rolesName: string[] = [];
  listRoles: any;
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;

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
    this.user.isActive = true;

    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
      this._rolesService.checkRoles().subscribe(w => {
        this.listRoles = w;
        this.listRoles.forEach(element => {
          this.rolesName.push(result.items.find(w => w.name === element).normalizedName);
        });
        this.setInitialRolesStatus();
      });
    });

    this.form.get('MatKhau').valueChanges.subscribe(val => {
      if (val !== null && val !== undefined && val.length > 0 && this.form.get('XacNhanMatKhau').value.length > 0 && this.form.get('XacNhanMatKhau').value !== val) {
        this.form.get('XacNhanMatKhau').setErrors({ passWordLength: true });
      } else {
        this.form.get('XacNhanMatKhau').setErrors(null);
      }
    });
    // tslint:disable-next-line:no-identical-functions
    this.form.get('XacNhanMatKhau').valueChanges.subscribe(val => {
      if (val !== null && val !== undefined && val.length > 0 && this.form.get('MatKhau').value.length > 0 &&
      this.form.get('MatKhau').value !== val) {
        this.form.get('XacNhanMatKhau').setErrors({ passWordLength: true });
      } else {
        this.form.get('XacNhanMatKhau').setErrors(null);
      }
    });
  }

  khoiTaoForm() {
    this.form = this.fb.group({
      HoTen: ['', Validators.required],
      ChucVu: [''],
      DiaChi: [''],
      EmailAddress: ['', Validators.required],
      TenDangNhap: ['', Validators.required],
      SoDienThoai: [''],
      MatKhau: ['', Validators.required],
      XacNhanMatKhau: ['', Validators.required],
      TinhTrang: [true],
      GhiChu: [''],
    });
    // this.form.get('MatKhau').valueChanges.subscribe(val => {
    //   if (val !== this.form.get('XacNhanMatKhau').value) {
    //     this.form.get('XacNhanMatKhau').setErrors({ validateEqual: true });
    //   } else if (val) {
    //     this.form.get('XacNhanMatKhau').setErrors(null);
    //   }
    // });
    // this.form.get('XacNhanMatKhau').valueChanges.subscribe(val => {
    //   if (val !== this.form.get('MatKhau').value) {
    //     this.form.get('XacNhanMatKhau').setErrors({ validateEqual: true });
    //   } else if (val) {
    //     this.form.get('XacNhanMatKhau').setErrors(null);
    //   }
    // });
  }

  setInitialRolesStatus(): void {
    _.map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return _.includes(this.rolesName, normalizedName);
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
      if (this.user.userName.toLocaleLowerCase() === 'admin') {
        this.showWarningMessage(this.l('qlnguoidung_adminkodctrung'));
        this.saving = false;
      } else {
        this._userService.checkExist(this.user.userName, this.user.emailAddress, 0).subscribe((res) => {
          switch (res) {
            case 0: {
              this._userService
                .create(this.user)
                .pipe(
                  finalize(() => {
                    this.saving = false;
                  })
                )
                .subscribe(() => {
                  this.showCreateMessage();
                  this.bsModalRef.hide();
                  this.onSave.emit();
                });
              break;
            }
            case 1: {
              this.showExistMessage(this.l('qlnguoidung_tendndatontai'));
              this.saving = false;
              break;
            }
            case 2: {
              this.showExistMessage(this.l('qlnguoidung_emaildatontai'));
              this.saving = false;
              break;
            }
            default:
              break;
          }
        });
      }
    }
  }

  private _getValueForSave() {
    this.user.name = this.form.controls.HoTen.value;
    this.user.surname = this.form.controls.HoTen.value;
    this.user.userName = this.form.controls.TenDangNhap.value;
    this.user.password = this.form.controls.MatKhau.value;
    this.user.isActive = this.form.controls.TinhTrang.value;
    this.user.diaChi = this.form.controls.DiaChi.value;
    this.user.chucVu = this.form.controls.ChucVu.value;
    this.user.phoneNumber = this.form.controls.SoDienThoai.value;
    this.user.ghiChu = this.form.controls.GhiChu.value;
    this.user.emailAddress = this.form.controls.EmailAddress.value;
  }
}
