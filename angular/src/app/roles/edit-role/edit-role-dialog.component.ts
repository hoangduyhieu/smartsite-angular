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
  GetRoleForEditOutput,
  RoleDto,
  RoleEditDto,
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonComponent } from '@shared/dft/components/common.component';
import { PermissionTreeEditModel } from '@shared/dft/components/permission-tree-edit.model';

@Component({
  templateUrl: 'edit-role-dialog.component.html'
})
export class EditRoleDialogComponent extends AppComponentBase
  implements OnInit {

  rolesTrees: PermissionTreeEditModel;
  roleValue: string[];
  saving = false;
  isPermissionActive = false;
  id: number;
  role = new RoleEditDto();

  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private _roleService: RoleServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.khoiTaoForm();
    this._roleService
      .getRoleForEdits(this.id)
      .subscribe((result: GetRoleForEditOutput) => {
        this.rolesTrees = {
          data: result.permissions,
          selectedData: [],
          permissions: result.permissions,
          grantedPermissionNames: result.grantedPermissionNames,
        };
        this.role = result.role;
        this._setValueForEdit();
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
      this._roleService.checkExist(this.role.name, this.role.displayName, this.role.id).subscribe((res) => {
        switch (res) {
          case 0: {
            const role = new RoleDto();
            role.init(this.role);
            role.grantedPermissions = this.roleValue;
            this._roleService
              .update(role)
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

  private _setValueForEdit() {
    this.form.controls.TenVaiTro.setValue(this.role.name);
    this.form.controls.TenHienThi.setValue(this.role.displayName);
    this.form.controls.GhiChu.setValue(this.role.description);
  }

  private _getValueForSave() {
    this.role.name = this.form.controls.TenVaiTro.value;
    this.role.displayName = this.form.controls.TenHienThi.value;
    this.role.description = this.form.controls.GhiChu.value;
  }
}
