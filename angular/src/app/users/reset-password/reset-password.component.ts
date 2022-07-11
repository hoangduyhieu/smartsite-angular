import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import {
  UserServiceProxy,
  ResetPasswordDto,
  LogOutInput
} from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordDialogComponent extends AppComponentBase
  implements OnInit {
  public isLoading = false;
  public resetPasswordDto = new ResetPasswordDto();
  passUser: string;
  id: number;
  logOutInput = new LogOutInput();

  newPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit() {
    this.isLoading = true;
    this.resetPasswordDto = new ResetPasswordDto();
    this.resetPasswordDto.userId = this.id;
    // tslint:disable-next-line:no-commented-code
    // this.resetPasswordDto.newPassword = Math.random()
    //   .toString(36)
    //   .substr(2, 10);
    this.isLoading = false;
  }

  public resetPassword(): void {
    this.isLoading = true;
    this._userService
      .resetPassword(this.resetPasswordDto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.swal.fire(
          undefined,
          this.l('qlnguoidung_successrecover'),
          'success'
        );
        this.bsModalRef.hide();
        this.logOutInput.taiKhoanId = this.id;
        this._userService.postLogOut(this.logOutInput).subscribe();
      });
  }
}
