/* tslint:disable */
import { TenantAvailabilityState, KieuDuLieu, LoaiThietBi, ChucVuNhanVienRaVaoTram } from '@shared/service-proxies/service-proxies';


export class AppTenantAvailabilityState {
    static Available: number = TenantAvailabilityState._1;
    static InActive: number = TenantAvailabilityState._2;
    static NotFound: number = TenantAvailabilityState._3;
}

export class AppKieuDuLieu {
    static Boolean: number = KieuDuLieu._1;
    static String: number = KieuDuLieu._2;
    static Long: number = KieuDuLieu._3;
    static Double: number = KieuDuLieu._4;
    static Json: number = KieuDuLieu._5;
}

export class AppLoaiThietBi {
    // cam bien
    static CamBienChuyenDong: number = LoaiThietBi._100;
    static CamBienKhoi: number = LoaiThietBi._101;
    static CamBienChay: number = LoaiThietBi._102;
    static CamBienCua: number = LoaiThietBi._103;
    static CamBienNgapNuoc: number = LoaiThietBi._104;
    static CamBienGocNghiengAngten: number = LoaiThietBi._105;
    static CamBienNhietDoDoAm: number = LoaiThietBi._106;
    static CamBienNhietDo: number = LoaiThietBi._107;
    static CamBienDoAm: number = LoaiThietBi._108;
    static CamBienDienAp: number = LoaiThietBi._109;
    static CamBienDongDien: number = LoaiThietBi._110;
    static CamBienNhienLieu: number = LoaiThietBi._111;

    // dieu khien
    static CuaRaVao: number = LoaiThietBi._200;
    static DieuHoa: number = LoaiThietBi._201;
    static QuatGio: number = LoaiThietBi._202;
    static CuaChuyenMachAts: number = LoaiThietBi._203;
    static Nguon5V: number = LoaiThietBi._204;
    static Nguon12V: number = LoaiThietBi._205;
    static DenBaoDong: number = LoaiThietBi._206;
    static CoiBaoDong: number = LoaiThietBi._207;
    static MayPhatDien: number = LoaiThietBi._208;
    static ContactCapDienLuoi: number = LoaiThietBi._209;
    static ContactCapDienMayPhat: number = LoaiThietBi._210;

    // camera
    static Camera: number = LoaiThietBi._300;

    // module tich hop
    static ModuleTichHop: number = LoaiThietBi._400;
}

export class AppChucVuNhanVienRaVaoTram {
    static QuanLy: number = ChucVuNhanVienRaVaoTram._1;
    static NhanVien: number = ChucVuNhanVienRaVaoTram._2;
}

export class AppSpecType {
    static SIMPLE: string = 'SIMPLE';
    static DURATION: string = 'DURATION';
}
export class AppOperatorAndOr {
    static AND: number = 1;
    static OR: number = 2;
}

export class AppSpecUnit {
    static SECONDS: string = 'SECONDS';
    static MINUTES: string = 'MINUTES';
    static HOURS: string = 'HOURS';
    static DAYS: string = 'DAYS';
}

export class AppKeyFilterValueType {
    static STRING: string = 'STRING';
    static NUMERIC: string = 'NUMERIC';
    static BOOLEAN: string = 'BOOLEAN';
    static DATE_TIME: string = 'DATE_TIME';
}

export class AppEntityKeyType {
    static ATTRIBUTE: string = 'ATTRIBUTE';
    static CLIENT_ATTRIBUTE: string = 'CLIENT_ATTRIBUTE';
    static SHARED_ATTRIBUTE: string = 'SHARED_ATTRIBUTE';
    static SERVER_ATTRIBUTE: string = 'SERVER_ATTRIBUTE';
    static TIME_SERIES: string = 'TIME_SERIES';
    static ENTITY_FIELD: string = 'ENTITY_FIELD';
    static ALARM_FIELD: string = 'ALARM_FIELD';
}

export class AppKeyFilterPredicateOperation {
    static EQUAL: string = 'EQUAL';
    static NOT_EQUAL: string = 'NOT_EQUAL';
    static GREATER: string = 'GREATER';
    static LESS: string = 'LESS';
    static GREATER_OR_EQUAL: string = 'GREATER_OR_EQUAL';
    static LESS_OR_EQUAL: string = 'LESS_OR_EQUAL';
    static STARTS_WITH: string = 'STARTS_WITH';
    static ENDS_WITH: string = 'ENDS_WITH';
    static CONTAINS: string = 'CONTAINS';
    static NOT_CONTAINS: string = 'NOT_CONTAINS';
}

export class AppAlarmColor {
    static RED: number = 1;
    static ORANGE: number = 2;
    static YELLOW: number = 3;
    static GREEN: number = 4;
    static GREY: number = 5;
}

export class AppAlarmSound {
    static Loai_1: number = 1;
    static Loai_2: number = 2;
    static Loai_3: number = 3;
    static Loai_4: number = 4;
    static Loai_5: number = 5;
}

export class AppTrueFalse {
    static TRUE: boolean = true;
    static FALSE: boolean = false;
}
