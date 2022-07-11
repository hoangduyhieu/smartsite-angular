import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from 'abp-ng2-module';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        ApiServiceProxies.DemoServiceProxy,
        ApiServiceProxies.DMMauDieuKhienServiceProxy,
        ApiServiceProxies.DMMauThuocTinhServiceProxy,
        ApiServiceProxies.DMMauDuLieuCamBienServiceProxy,
        ApiServiceProxies.LookupTableServiceProxy,
        ApiServiceProxies.AuditLogServiceProxy,
        ApiServiceProxies.DMMauCanhBaoServiceProxy,
        ApiServiceProxies.DMTramServiceProxy,
        ApiServiceProxies.DMNhanVienRaVaoTramServiceProxy,
        ApiServiceProxies.DMThietBiServiceProxy,
        ApiServiceProxies.DMPhanVungServiceProxy,
        ApiServiceProxies.DMNguoiNhanCanhBaoServiceProxy,
        ApiServiceProxies.DMBoCanhBaoServiceProxy,
        ApiServiceProxies.DMCanhBaoServiceProxy,
        ApiServiceProxies.TramDieuKhienServiceProxy,
        ApiServiceProxies.GiamSatCamBienServiceProxy,
        ApiServiceProxies.DuLieuCamBienServiceProxy,
        ApiServiceProxies.CauHinhChungServiceProxy,
        ApiServiceProxies.DMQuanLyCanhBaoServiceProxy,
        ApiServiceProxies.DashboardServiceProxy,
        ApiServiceProxies.BaoCaoLogHeThongServiceProxy,
        ApiServiceProxies.BaoCaoKetQuaGuiNhanTinCanhBaoServiceProxy,
        ApiServiceProxies.BaoCaoCanhBaoCacTramServiceProxy,
        ApiServiceProxies.BaoCaoThongTinTramServiceProxy,
        ApiServiceProxies.BaoCaoTrangThaiKetNoiTramServiceProxy,
        ApiServiceProxies.BaoCaoDanhSachVaMaCacTramServiceProxy,
        ApiServiceProxies.BaoCaoCanhBaoCacTramServiceProxy,
        ApiServiceProxies.BaoCaoNhienLieuMayNoServiceProxy,
        ApiServiceProxies.BaoCaoChiTietCanhBaoServiceProxy,
        ApiServiceProxies.NhatKyLamViecServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
