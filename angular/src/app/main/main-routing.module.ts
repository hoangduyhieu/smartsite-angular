import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                ],
            },
            {
                path: 'danh-muc',
                loadChildren: () => import('./danh-muc/danh-muc.module').then((m) => m.DanhMucModule),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MainRoutingModule { }
