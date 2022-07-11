// tslint:disable
import { Injector, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
    LocalizationService,
    PermissionCheckerService,
    FeatureCheckerService,
    NotifyService,
    SettingService,
    MessageService,
    AbpMultiTenancyService
} from 'abp-ng2-module';

import { AppSessionService } from '@shared/session/app-session.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Observable } from 'rxjs';
import { LookupTableDto, TreeviewItemDto } from './service-proxies/service-proxies';
import { TreeviewItem } from 'ngx-treeview';
import { Table } from 'primeng/table';

export abstract class AppComponentBase {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    elementRef: ElementRef;

    // Datetime Start
    dateFormatPipe = 'dd/MM/yyyy'; // format cho định dạng date
    dateFormatInput = 'dd/mm/yy'; // format cho định dạng date
    dateFormatInsert = 'YYYY-MM-DD'; // format cho định dạng date để insert vào db
    dateTimeFormatInsert = 'YYYY-MM-DD HH:mm:ss'; // format cho định dạng date để insert vào db
    dateTimeFormatPipe = 'dd/MM/yyyy HH:mm:ss'; // format cho định dạng date để insert vào db
    dateFormatMonthOnlyInput = 'mm/yy'; // format cho định dạng date
    dateFormatMonthOnlyInsert = 'YYYY-MM'; // format cho định dạng date
    hourFormat12Input = '12';     // Time định dạng 12h
    hourFormat24Input = '24';     // Time định dạng 24h
    timeFormatInsert = 'HH:mm'; // Khoảng năm từ 2020-2030
    yearRange = '2020:2030'; // Khoảng năm từ 2020-2030
    today = new Date();      // Ngày hôm nay
    // Datetime End

    // Primeng Table Start
    paginator = true;
    showCurrentPageReport = true;
    paginatorRows = 20; // Số dòng hiển thị mặc định 1 page
    rowsPerPageOptions = [20, 50, 100, 250]; // Chọn số record trong 1 page
    scrollHeight = '480px';  // độ rộng để table cuộn tùy theo màn hình
    separator = ',';
    pixel: boolean;
    // datetime
    readonlyInput = true;    // Không cho date được nhập
    showButtonBar = true;    // Hiển thị nút today và clear
    scrollable = true;       // Có cuộn table không
    minFractionDigits = 2;
    maxFractionDigits = 2;
    swal = Swal;
    excelAcceptTypes = '.xlsx,.xls';
    imateAcceptTypes = 'image/*';
    confirmButtonColor = '#3085d6';
    cancelButtonColor = '#d33';
    cancelButtonText = 'Btn_Huy';
    confirmButtonText = 'Confirm';
    deleteButtonText = 'Delete1';
    saveButtonText = 'Save';
    khongCoDuLieu = 'khongcodulieu';
    dropdownPlaceholder = 'chose';
    language = '';
    constructor(
        injector: Injector,
    ) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.elementRef = injector.get(ElementRef);
        abp.utils.setCookieValue(
            'Abp.Localization.CultureName',
            'vi',
            new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
            abp.appPath
        );
        this.language = abp.utils.getCookieValue(
            'Abp.Localization.CultureName'
        );
    }

    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }

    isGrantedAny(...permissions: string[]): boolean {
        if (!permissions) {
            return false;
        }

        for (const permission of permissions) {
            if (this.isGranted(permission)) {
                return true;
            }
        }

        return false;
    }

    getSortField(table?: Table): string {
        return table && table.sortField ? (table.sortField + (table.sortOrder === 1 ? ' ASC' : ' DESC')) : undefined;
    }

    showCreateMessage() {
        this.notify.success(this.l("SuccessCreate"));
    }

    showSaveMessage() {
        this.notify.success(this.l("SuccessSave"));
    }

    showUpdateMessage() {
        this.notify.success(this.l("SuccessUpdate"));
    }

    showDeleteMessage() {
        this.notify.success(this.l("SuccessDelete"));
    }

    showUploadMessage() {
        this.notify.success(this.l("UploadSuccess"));
    }

    showSuccessMessage(message: string) {
        this.notify.success(message);
    }

    showSuccessMessageTimer(message: string, a?: string, option1?: any) {
        this.notify.success(message, a, option1);
    }

    showWarningMessageTimer(message: string, a?: string, option1?: any){
        this.notify.warn(message, a, option1);
    }

    showWarningMessage(message: string, a?: string, option1?: any) {
        this.notify.warn(message, a, option1);
    }

    showErrorMessage(message: string) {
        this.notify.error(message);
    }

    showExistMessage(message: string, type = 'error') {
        this.swal.fire(
            undefined,
            message,
            type,
        );
    }

    showWarningPopUpMessage(message: string, type = 'warning') {
        this.swal.fire(
            undefined,
            message,
            type,
        );
    }

    getLinkFile(res, fileName) {
        return res ? '\\' + res['result'][res['result']
            .findIndex(e => e.includes(fileName))].split('\\').slice(-2).join('\\') : '';
    }

    blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;

        //Cast to a File() type
        return <File>theBlob;
    }
    getTreeviewItem(items: TreeviewItemDto[]) {
        return items.map(e => {
            return new TreeviewItem({
                value: e.value,
                text: e.text,
                children: e.children,
                checked: e.checked,
                collapsed: e.collapsed,
                disabled: e.disabled
            });
        });
    }

    pipeType(mucdo: string) {
        if (this.language === 'vi') {
            switch (mucdo) {
                case 'Total': {
                    mucdo = 'Tổng'
                    break;
                };
                case 'Critical': {
                    mucdo = 'Nghiêm trọng'
                    break;
                };
                case 'Major': {
                    mucdo = 'Nguy hiểm'
                    break;
                };
                case 'Minor': {
                    mucdo = 'Trung bình'
                    break;
                };
                case 'Warning': {
                    mucdo = 'Chú ý'
                    break;
                };
                case 'Indeterminate': {
                    mucdo = 'Không xác định'
                    break;
                };
            }
        }
        if (this.language === 'en') {
            mucdo = mucdo;
        }
        return mucdo;
    }

    pipeSearch(mucdo: string) {
        // Tìm kiếm ngược
        if (this.language === 'vi') {
            switch (mucdo?.trim().replace('\t', "").toLowerCase()) {
                case 'nghiêm trọng': {
                    mucdo = 'critical'
                    break;
                };
                case 'nguy hiểm': {
                    mucdo = 'major'
                    break;
                };
                case 'minor': {
                    mucdo = 'trung bình'
                    break;
                };
                case 'chú ý': {
                    mucdo = 'warning'
                    break;
                };
                case 'không xác định': {
                    mucdo = 'indeterminate'
                    break;
                };
            }
        }
        return mucdo;
    }

    pipeBaoCao(mucdo: string) {
        // Tìm kiếm ngược
        if (this.language === 'vi') {
            switch (mucdo) {
                case 'Active-Unack': {
                    mucdo = 'Chưa xử lý - Chưa xác nhận'
                    break;
                };
                case 'Active-Ack': {
                    mucdo = 'Chưa xử lý - Đã xác nhận'
                    break;
                };
                case 'Cleared-Unack': {
                    mucdo = 'Đã xử lý - Chưa xác nhận'
                    break;
                };
                case 'Cleared-Ack': {
                    mucdo = 'Đã xử lý - Đã xác nhận'
                    break;
                };
            }
        }
        return mucdo;
    }

    pipeListMucDo(listMucDo: LookupTableDto[]) {
        let rs = new Array<LookupTableDto>();
        listMucDo.forEach(element => {
            let items = new LookupTableDto;
            items.id = element.id;
            items.displayName = this.pipeType(element.displayName);
            rs.push(items);
        });
        return rs;
    }

}
