import { DanhMucRoutingModule } from './danh-muc-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { DemoComponent } from './demo/demo.component';
import { DemoChartNgXComponent } from './demo/demochart-ngxchart/demochart-ngx.component';
import { CreateOrEditDemoDialogComponent } from './demo/create-or-edtit/create-or-edit-demo-dialog.component';
import { MauDieuKhienComponent } from './mau-dieu-khien/mau-dieu-khien.component';
import { MauDieuKhienCreateOrEditDialogComponent } from './mau-dieu-khien/create-or-edit/mau-dieu-khien-create-or-edit-dialog.component';
import { MauDuLieuCamBienComponent } from './mau-du-lieu-cam-bien/mau-du-lieu-cam-bien.component';
import { MauDuLieuCamBienCreateOrEditDialogComponent } from './mau-du-lieu-cam-bien/create-or-edit/mau-du-lieu-cam-bien-create-or-edit-dialog.component';
import { MauThuocTinhComponent } from './mau-thuoc-tinh/mau-thuoc-tinh.component';
import { MauThuocTinhCreateOrEditDialogComponent } from './mau-thuoc-tinh/create-or-edit/mau-thuoc-tinh-create-or-edit-dialog.component';
import { NhanVienRaVaoTramComponent } from './nhan-vien-ra-vao-tram/nhan-vien-ra-vao-tram.component';
import { NhanVienRaVaoTramCreateOrEditDialogComponent } from './nhan-vien-ra-vao-tram/create-or-edit/nhan-vien-ra-vao-tram-create-or-edit-dialog.component';
import { PhanVungComponent } from './phan-vung/phan-vung.component';
import { PhanVungCreateOrEditDialogComponent } from './phan-vung/create-or-edit/phan-vung-create-or-edit-dialog.component';
import { ThietBiComponent } from './thiet-bi/thiet-bi.component';
import { ThietBiCreateOrEditDialogComponent } from './thiet-bi/create-or-edit/thiet-bi-create-or-edit-dialog.component';
import { TramComponent } from './tram/tram.component';
import { CauHinhTramComponent } from './tram/tram-config/cau-hinh-tram.component';
import { CreateOrEditMauDieuKhienTramComponent } from './tram/tram-config/create-or-edit-mau-dieu-khien/create-or-edit-mau-dieu-khien-tram.component';
import { CreateOrEditMauCanhBaoTramComponent } from './tram/tram-config/create-or-edit-mau-canh-bao-tram/create-or-edit-mau-canh-bao-tram.component';
import { ConfigNhieuTramComponent } from './tram/tram-config/config-nhieu-tram/cau-hinh-nhieu-tram.component';
import { CreateOrEditNhieuMauCanhBaoTramComponent } from './tram/tram-config/config-nhieu-tram/create-or-edit-nhieu-tram-canh-bao/create-or-edit-nhieu-tram-canh-bao.component';
import { CreateOrEditNhieuMauDieuKhienTramComponent } from './tram/tram-config/config-nhieu-tram/create-or-edit-nhieu-tram-dieu-khien/create-or-edit-nhieu-tram-dieu-khien.component';
import { TramCreateOrEditDialogComponent } from './tram/create-or-edit/tram-create-or-edit-dialog.component';
import { MauCanhbaoCreateOrEditDialogComponent } from './mau-canh-bao/create-or-edit/mau-canh-bao-create-or-edit-dialog.component';
import { MauCanhBaoComponent } from './mau-canh-bao/mau-canh-bao.component';
import { TramViewDetailComponent } from './tram/tram-view-detail/tram-view-detail.component';
import { TramThongTinChungComponent } from './tram/tram-view-detail/tram-thong-tin-chung/tram-thong-tin-chung.component';
import { CanhBaoTramViewComponent } from './tram/tram-view-detail/canh-bao-tram-view/canh-bao-tram-view.component';
import { BoCanhBaoComponent } from './bo-canh-bao/bo-canh-bao.component';
import { ThongSoChungComponent } from './thong-so-chung/thong-so-chung.component';
import { BoCanhBaoCreateOrEditDialogComponent } from './bo-canh-bao/create-or-edit/bo-canh-bao-create-or-edit-dialog.component';
import { NguoiNhanCanhBaoComponent } from './nguoi-nhan-canh-bao/nguoi-nhan-canh-bao.component';
import { NguoiNhanCanhBaoCreateOrEditDialogComponent } from './nguoi-nhan-canh-bao/create-or-edit/nguoi-nhan-canh-bao-create-or-edit-dialog.component';
import { CanhBaoCreateOrEditComponent } from './bo-canh-bao/canh-bao-create-or-edit/canh-bao-create-or-edit.component';
import { AlarmCreateOrEditComponent } from './bo-canh-bao/alarm-create-or-edit/alarm-create-or-edit.component';
import { BaoCaoThongTinTramComponent } from './bao-cao/bao-cao-thong-tin-tram/bao-cao-thong-tin-tram.component';
import { BaoCaoCanhBaoTramComponent } from './bao-cao/bao-cao-canh-bao-tram/bao-cao-canh-bao-tram.component';
import { BaoCaoKetQuaGuiNhanTinCanhBaoComponent } from './bao-cao/bao-cao-ket-qua-gui-nhan-tin-canh-bao/bao-cao-ket-qua-gui-nhan-tin-canh-bao.component';
import { BaoCaoTrangThaiKetNoiTramComponent } from './bao-cao/bao-cao-trang-thai-ket-noi-tram/bao-cao-trang-thai-ket-noi-tram.component';
import { BaoCaoNhienLieuMayNoComponent } from './bao-cao/bao-cao-nhien-lieu-may-no/bao-cao-nhien-lieu-may-no.component';
import { BaoCaoLogHeThongComponent } from './bao-cao/bao-cao-log-he-thong/bao-cao-log-he-thong.component';
import { BaoCaoDanhSachVaMaCacTramComponent } from './bao-cao/bao-cao-danh-sach-va-ma-cac-tram/bao-cao-danh-sach-va-ma-cac-tram.component';
import { TramThongTinDieuKhienComponent } from './tram/tram-view-detail/tram-thong-tin-chung/tram-thong-tin-dieu-khien/tram-thong-tin-dieu-khien.component';
import { TramThongTinCamBienComponent } from './tram/tram-view-detail/tram-thong-tin-chung/tram-thong-tin-cam-bien/tram-thong-tin-cam-bien.component';
import { TramNhanVienRaVaoTramComponent } from './tram/tram-view-detail/tram-nhan-vien-ra-vao-tram/tram-nhan-vien-ra-vao-tram.component';
import { TramGanNhanVienComponent } from './tram/tram-view-detail/tram-nhan-vien-ra-vao-tram/tram-gan-nhan-vien/tram-gan-nhan-vien.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DuLieuCamBienComponent } from './tram/tram-view-detail/du-lieu-cam-bien/du-lieu-cam-bien.component';
import {MenuModule, PanelModule} from 'primeng';
import { QuanLyCanhBaoComponent } from './quan-ly-canh-bao/quan-ly-canh-bao.component';
import { ViewQuanLyCanhBaoComponent } from './quan-ly-canh-bao/view-detail-dm-canh-bao/view-quan-ly-canh-bao/view-quan-ly-canh-bao.component';
import { XemChiTietCanhBaoComponent } from './tram/tram-view-detail/canh-bao-tram-view/xem-chi-tiet/xem-chi-tiet-canh-bao/xem-chi-tiet-canh-bao.component';
import { ChiTietCanhBaoComponent } from './bao-cao/bao-cao-canh-bao-tram/chi-tiet-canh-bao/chi-tiet-canh-bao.component';
import { NhatKyLamViecComponent } from './nhat-ky-lam-viec/nhat-ky-lam-viec.component';
import { BaocaothingboardComponent } from './bao-cao/bao-cao-thingboard/baocaothingboard/baocaothingboard.component';
import { LogQuetTheComponent } from './log-quet-the/log-quet-the.component';
@NgModule({
    imports: [
        SharedModule,
        DanhMucRoutingModule,
        NgxChartsModule,
        PanelModule,
        MenuModule
    ],
    declarations: [
        DemoComponent,
        DemoChartNgXComponent,
        CreateOrEditDemoDialogComponent,
        MauDieuKhienComponent,
        MauDieuKhienCreateOrEditDialogComponent,
        MauDuLieuCamBienComponent,
        MauDuLieuCamBienCreateOrEditDialogComponent,
        MauThuocTinhComponent,
        MauThuocTinhCreateOrEditDialogComponent,
        NhanVienRaVaoTramComponent,
        NhanVienRaVaoTramCreateOrEditDialogComponent,
        PhanVungComponent,
        PhanVungCreateOrEditDialogComponent,
        ThietBiComponent,
        ThietBiCreateOrEditDialogComponent,
        TramComponent,
        TramCreateOrEditDialogComponent,
        MauCanhbaoCreateOrEditDialogComponent,
        MauCanhBaoComponent,
        TramViewDetailComponent,
        TramThongTinChungComponent,
        BoCanhBaoComponent,
        BoCanhBaoCreateOrEditDialogComponent,
        NguoiNhanCanhBaoComponent,
        NguoiNhanCanhBaoCreateOrEditDialogComponent,
        CanhBaoCreateOrEditComponent,
        AlarmCreateOrEditComponent,
        CauHinhTramComponent,
        CreateOrEditMauDieuKhienTramComponent,
        CreateOrEditMauCanhBaoTramComponent,
        CanhBaoTramViewComponent,
        ConfigNhieuTramComponent,
        CreateOrEditNhieuMauCanhBaoTramComponent,
        CreateOrEditNhieuMauDieuKhienTramComponent,
        BaoCaoThongTinTramComponent,
        BaoCaoCanhBaoTramComponent,
        BaoCaoKetQuaGuiNhanTinCanhBaoComponent,
        BaoCaoTrangThaiKetNoiTramComponent,
        BaoCaoNhienLieuMayNoComponent,
        BaoCaoLogHeThongComponent,
        BaoCaoDanhSachVaMaCacTramComponent,
        TramThongTinCamBienComponent,
        TramNhanVienRaVaoTramComponent,
        CreateOrEditMauCanhBaoTramComponent,
        TramThongTinDieuKhienComponent,
        TramGanNhanVienComponent,
        DuLieuCamBienComponent,
        ThongSoChungComponent,
        QuanLyCanhBaoComponent,
        XemChiTietCanhBaoComponent,
        ChiTietCanhBaoComponent,
        NhatKyLamViecComponent,
        BaocaothingboardComponent,
        LogQuetTheComponent
    ],
})
export class DanhMucModule { }
