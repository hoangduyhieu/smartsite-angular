import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { ForgotPaswordComponent } from './forgot-pasword/forgot-pasword.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ForgotChangeComponent } from './forgot-change/forgot-change.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    { path: 'login', component: LoginComponent },
                    { path: 'register', component: RegisterComponent },
                    { path: 'forgot-password', component: ForgotPaswordComponent },
                    {
                        path: 'forgot-password-change', component: ForgotChangeComponent
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
