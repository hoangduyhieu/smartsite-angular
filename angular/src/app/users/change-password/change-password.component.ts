import { LogOutInput, LookupTableServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ChangePasswordDto,
  UserServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';

@Component({
  templateUrl: './change-password.component.html',
  animations: [appModuleAnimation()]
})
export class ChangePasswordComponent extends AppComponentBase {
  saving = false;
  changePasswordDto = new ChangePasswordDto();
  fieldTextType: boolean;
  fieldTextType1: boolean;
  fieldTextTypePass: boolean;
  logOutInput = new LogOutInput();

  @ViewChild('currentPasswordEl') passwor;
  @ViewChild('newPasswordEl') newPasswor;
  @ViewChild('confirmNewPasswordEl') confirmNewPasswor;

  newPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmNewPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  constructor(
    injector: Injector,
    private _lookupTableServiceProxy: LookupTableServiceProxy,
    private _userService: UserServiceProxy,
    private _router: Router
  ) {
    super(injector);
  }
  clearValue(): void {
    this.changePasswordDto = new ChangePasswordDto();
    this.confirmNewPasswor.nativeElement.value = '';
  }

  changePassword() {
    this.saving = true;
    this.logOutInput.taiKhoanId = this.appSession.userId;
    this._lookupTableServiceProxy
      .changePassword(this.changePasswordDto)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((success) => {
        if (success) {
          this.showSuccessMessage(this.l('qlnguoidung_doimkthanhcong'));
          this._userService.postLogOut(this.logOutInput).subscribe();
          // tslint:disable-next-line:no-commented-code
          // this._router.navigate(['/app/users']);
        }
      });
  }

  toggleFieldTextTypePass() {
    if (this.fieldTextTypePass) {
      this.passwor.nativeElement.type = 'password';
    } else {
      this.passwor.nativeElement.type = 'text';
    }
    this.fieldTextTypePass = !this.fieldTextTypePass;
  }

  toggleFieldTextType() {
    if (this.fieldTextType) {
      this.newPasswor.nativeElement.type = 'password';
    } else {
      this.newPasswor.nativeElement.type = 'text';
    }
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextType1() {
    if (this.fieldTextType1) {
      this.confirmNewPasswor.nativeElement.type = 'password';
    } else {
      this.confirmNewPasswor.nativeElement.type = 'text';
    }
    this.fieldTextType1 = !this.fieldTextType1;
  }
}
