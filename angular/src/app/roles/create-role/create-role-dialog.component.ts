// tslint:disable
import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
  RoleServiceProxy,
  RoleDto,
  CreateRoleDto,
  FlatPermissionDto
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonComponent } from '@shared/dft/components/common.component';
import { PermissionTreeEditModel } from '@shared/dft/components/permission-tree-edit.model';

@Component({
  templateUrl: 'create-role-dialog.component.html'
})
export class CreateRoleDialogComponent extends AppComponentBase
  implements OnInit {
  rolesTrees: PermissionTreeEditModel;
  saving = false;
  role = new RoleDto();
  roleValue: string[];

  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;
  constructor(
    injector: Injector,
    private _roleService: RoleServiceProxy,
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.khoiTaoForm();
    this._roleService
      .getAllPermissions()
      .subscribe((result) => {
        this.rolesTrees = {
          data: result,
          selectedData: [],
          permissions: result,
          grantedPermissionNames: [],
        };
      });
  }

  khoiTaoForm() {
    this.form = this.fb.group({
      TenVaiTro: ['', Validators.required],
      TenHienThi: ['', Validators.required],
      GhiChu: [''],
    });
  }

  save(): void {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.saving = true;
      this._getValueForSave();
      this._roleService.checkExist(this.role.name, this.role.displayName, 0).subscribe((res) => {
        switch (res) {
          case 0: {
            const role = new CreateRoleDto();
            role.init(this.role);
            role.grantedPermissions = this.roleValue;
            this._roleService
              .create(role)
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
            this.showExistMessage('Tên vai trò đã tồn tại!');
            this.saving = false;
            break;
          }
          case 2: {
            this.showExistMessage('Tên hiển thị đã tồn tại!');
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
    this.role.name = this.form.controls.TenVaiTro.value;
    this.role.displayName = this.form.controls.TenHienThi.value;
    this.role.description = this.form.controls.GhiChu.value;
  }
}
