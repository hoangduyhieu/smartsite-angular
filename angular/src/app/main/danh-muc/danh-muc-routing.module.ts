import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DemoComponent } from './demo/demo.component';
import { AppRouteGuard } from '../../../shared/auth/auth-route-guard';
import { MauDieuKhienComponent } from './mau-dieu-khien/mau-dieu-khien.component';
import { MauDuLieuCamBienComponent } from './mau-du-lieu-cam-bien/mau-du-lieu-cam-bien.component';
import { MauThuocTinhComponent } from './mau-thuoc-tinh/mau-thuoc-tinh.component';
import { NhanVienRaVaoTramComponent } from './nhan-vien-ra-vao-tram/nhan-vien-ra-vao-tram.component';
import { PhanVungComponent } from './phan-vung/phan-vung.component';
import { TramComponent } from './tram/tram.component';
import { ThietBiComponent } from './thiet-bi/thiet-bi.component';
import { TramViewDetailComponent } from './tram/tram-view-detail/tram-view-detail.component';
import { BoCanhBaoComponent } from './bo-canh-bao/bo-canh-bao.component';
import { NguoiNhanCanhBaoComponent } from './nguoi-nhan-canh-bao/nguoi-nhan-canh-bao.component';
import { MauCanhBaoComponent } from './mau-canh-bao/mau-canh-bao.component';
import { BaoCaoThongTinTramComponent } from './bao-cao/bao-cao-thong-tin-tram/bao-cao-thong-tin-tram.component';
import { BaoCaoDanhSachVaMaCacTramComponent } from './bao-cao/bao-cao-danh-sach-va-ma-cac-tram/bao-cao-danh-sach-va-ma-cac-tram.component';
import { BaoCaoKetQuaGuiNhanTinCanhBaoComponent } from './bao-cao/bao-cao-ket-qua-gui-nhan-tin-canh-bao/bao-cao-ket-qua-gui-nhan-tin-canh-bao.component';
import { BaoCaoLogHeThongComponent } from './bao-cao/bao-cao-log-he-thong/bao-cao-log-he-thong.component';
import { BaoCaoNhienLieuMayNoComponent } from './bao-cao/bao-cao-nhien-lieu-may-no/bao-cao-nhien-lieu-may-no.component';
import { BaoCaoTrangThaiKetNoiTramComponent } from './bao-cao/bao-cao-trang-thai-ket-noi-tram/bao-cao-trang-thai-ket-noi-tram.component';
import { BaoCaoCanhBaoTramComponent } from './bao-cao/bao-cao-canh-bao-tram/bao-cao-canh-bao-tram.component';
import { TramThongTinCamBienComponent } from './tram/tram-view-detail/tram-thong-tin-chung/tram-thong-tin-cam-bien/tram-thong-tin-cam-bien.component';
import { ThongSoChungComponent } from './thong-so-chung/thong-so-chung.component';
import { QuanLyCanhBaoComponent } from './quan-ly-canh-bao/quan-ly-canh-bao.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DemoChartNgXComponent } from './demo/demochart-ngxchart/demochart-ngx.component';
import { NhatKyLamViecComponent } from './nhat-ky-lam-viec/nhat-ky-lam-viec.component';
import { BaocaothingboardComponent } from './bao-cao/bao-cao-thingboard/baocaothingboard/baocaothingboard.component';
import { LogQuetTheComponent } from './log-quet-the/log-quet-the.component';

const permissionTram = 'Pages.QuanLyTram';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'demo', component: DemoComponent,
                data: { permission: '' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'demochart', component: DemoChartNgXComponent,
                data: { permission: '' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'mau-dieu-khien', component: MauDieuKhienComponent,
                canActivate: [AppRouteGuard]
            },
            {
                path: 'mau-canh-bao', component: MauCanhBaoComponent,
                canActivate: [AppRouteGuard]
            },
            {
                path: 'mau-du-lieu-cam-bien', component: MauDuLieuCamBienComponent,
                canActivate: [AppRouteGuard]
            },
            {
                path: 'mau-thuoc-tinh', component: MauThuocTinhComponent,
                canActivate: [AppRouteGuard]
            },
            {
                path: 'nhan-vien-ra-vao-tram', component: NhanVienRaVaoTramComponent,
                data: { permission: 'Pages.QuanLyNhanVienRaVaoTram' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'phan-vung', component: PhanVungComponent,
                data: { permission: 'Pages.QuanLyPhanVung' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'tram', component: TramComponent,
                data: { permission: permissionTram },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'thiet-bi', component: ThietBiComponent,
                data: { permission: permissionTram },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'tram/tram-view-detail/:idTram/:tbEntityId/:tab', component: TramViewDetailComponent,
                data: { permission: permissionTram },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bo-canh-bao', component: BoCanhBaoComponent,
                data: { permission: 'Pages.BoCanhBao' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'thong-so-chung', component: ThongSoChungComponent,
                data: { permission: permissionTram },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'nguoi-nhan-canh-bao', component: NguoiNhanCanhBaoComponent,
                data: { permission: 'Pages.QuanLyNguoiNhanCanhBao' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bao-cao-thong-tin-tram', component: BaoCaoThongTinTramComponent,
                data: { permission: 'Pages.BaoCaoThongTinTram' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bao-cao-danh-sach-va-ma-cac-tram', component: BaoCaoDanhSachVaMaCacTramComponent,
                data: { permission: 'Pages.BaoCaoDanhSachVaMaCacTram' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bao-cao-ket-qua-gui-nhan-tin-canh-bao', component: BaoCaoKetQuaGuiNhanTinCanhBaoComponent,
                data: { permission: 'Pages.BaoCaoGuiTinNhan' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bao-cao-log-he-thong', component: BaoCaoLogHeThongComponent,
                data: { permission: 'Pages.BaoCaoLog' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bao-cao-nhien-lieu-may-no', component: BaoCaoNhienLieuMayNoComponent,
                data: { permission: 'Pages.BaoCaoNhienLieuMayNo' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bao-cao-canh-bao-tram', component: BaoCaoCanhBaoTramComponent,
                data: { permission: 'Pages.BaoCaoCanhBao' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bao-cao-trang-thai-ket-noi-tram', component: BaoCaoTrangThaiKetNoiTramComponent,
                data: { permission: 'Pages.BaoCaoTrangThaiKetNoi' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'tram/tram-view-detail/tram-thong-tin-cam-bien/:idTram', component: TramThongTinCamBienComponent,
            },
            {
                path: 'bo-canh-bao', component: BoCanhBaoComponent,
                data: { permission: 'Pages.BoCanhBao' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'quan-ly-canh-bao', component: QuanLyCanhBaoComponent,
                data: { permission: 'Pages.QuanLyCanhBao' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'nhat-ky-lam-viec', component: NhatKyLamViecComponent,
                data: { permission: 'Pages.NhatKyLamViec' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'bao-cao-thingboard', component: BaocaothingboardComponent,
                data: { permission: 'Pages.BaoCaoTrend' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'log-quet-the', component: LogQuetTheComponent,
                data: { permission: 'Pages.LogQuetThe' },
                canActivate: [AppRouteGuard]
            }
        ])
    ],
    exports: [RouterModule],
    declarations: [],
    providers: [],
})
export class DanhMucRoutingModule { }
