import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { CommonComponent } from '@shared/dft/components/common.component';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  selector: 'app-forgot-pasword',
  templateUrl: './forgot-pasword.component.html',
  styleUrls: ['./forgot-pasword.component.scss'],
  animations: [accountModuleAnimation()]
})
export class ForgotPaswordComponent extends AppComponentBase implements OnInit {
  submitting = false;
  fieldTextType: boolean;
  email: string;
  form: FormGroup;
  @ViewChild('passwordEl') password;

  constructor(
    injector: Injector,
    private _fb: FormBuilder,
    private _router: Router,
    private _userService: UserServiceProxy,
    private _sessionService: AbpSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.khoiTaoForm();
  }

  khoiTaoForm() {
    this.form = this._fb.group({
      EmailAddress: ['', [Validators.required,
      Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{1,})+$'), Validators.maxLength(256)]],
    });
  }

  login(): void {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.submitting = true;
      this._userService.checkEmailAndCreateToken(this.form.controls.EmailAddress.value).subscribe(() => {
        this.showSuccessMessage('Đã gửi đường dẫn về email thành công!');
      });
    }
  }
}
