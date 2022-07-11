import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-forgot-change',
  templateUrl: './forgot-change.component.html',
  styleUrls: ['./forgot-change.component.scss'],
  animations: [accountModuleAnimation()]
})
export class ForgotChangeComponent extends AppComponentBase implements OnInit {
  submitting = false;
  fieldTextType: boolean;
  email: string;
  token: string;
  form: FormGroup;
  checkTokenValid = false;
  constructor(
    injector: Injector,
    public http: HttpClient,
    private _router: Router,
    private _userService: UserServiceProxy,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,

  ) {
    super(injector);
    this._route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  ngOnInit(): void {
      this._userService.checkToken(this.token).subscribe(w => {
        this.checkTokenValid = w;
    });
    this.khoiTaoForm();
  }

  khoiTaoForm() {
    this.form = this._fb.group({
      Password: ['', [Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
      Validators.maxLength(256)]],

      PassWordConfirm: ['', [Validators.required,
      Validators.maxLength(256)]],
    });

    this.form.get('Password').valueChanges.subscribe(val => {
      if (val !== null && val !== undefined && val.length > 0 && this.form.get('PassWordConfirm').value.length > 0 && this.form.get('PassWordConfirm').value !== val) {
        this.form.get('PassWordConfirm').setErrors({ passWordLength: true });
      } else {
        this.form.get('PassWordConfirm').setErrors(null);
      }
    });
    // tslint:disable-next-line:no-identical-functions
    this.form.get('PassWordConfirm').valueChanges.subscribe(val => {
      if (val !== null && val !== undefined && val.length > 0 && this.form.get('Password').value.length > 0 &&
        this.form.get('Password').value !== val) {
        this.form.get('PassWordConfirm').setErrors({ passWordLength: true });
      } else {
        this.form.get('PassWordConfirm').setErrors(null);
      }
    });
  }

  login(): void {
    if (CommonComponent.getControlErr(this.form) === '') {
      this.submitting = true;
      this._userService.sendPasswordResetCode(this.token, this.form.controls.Password.value).subscribe(() => {
        this.showSuccessMessage('Lấy lại mật khẩu thành công!');
      });
      this._router.navigate(['/account/login']);
    }
  }
}
