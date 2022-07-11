/* tslint:disable */
import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { extend } from 'lodash';

@Component({
  selector: 'header-user-menu',
  templateUrl: './header-user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserMenuComponent extends AppComponentBase{
  constructor(
    injector: Injector, 
    private _authService: AppAuthService) {
    super(injector);
  }

  logout(): void {
    this._authService.logout();
  }
}
