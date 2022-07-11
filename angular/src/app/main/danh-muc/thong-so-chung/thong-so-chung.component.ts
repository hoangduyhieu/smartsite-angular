import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { ValidationComponent } from '@shared/dft/components/validation-messages.component';
import { FileDownloadService } from '@shared/file-download.service';
import { CauHinhChungDto, CauHinhChungServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Accordion } from 'primeng/accordion';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
@Component({
    selector: 'app-thong-so-chung',
    templateUrl: './thong-so-chung.component.html',
    animations: [appModuleAnimation()],
})
export class ThongSoChungComponent extends AppComponentBase implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    @ViewChild('groupTab', { static: true }) groupTab: Accordion;
    form: FormGroup;
    collapsedAll = false;
    checked: boolean;
    input: CauHinhChungDto;
    saving = false;
    isEdit = false;
    id: number;

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public http: HttpClient,
        private _cauHinhChungService: CauHinhChungServiceProxy,
    ) { super(injector); }

    ngOnInit(): void {
        this.khoiTaoForm();
        this.collapsedAll = false;
        this.setCollapseAll(this.collapsedAll, [0]);

        this._cauHinhChungService.test().subscribe(rs => {
            if (rs === 0) {
                this.input = new CauHinhChungDto();
            } else {
                this._cauHinhChungService.getForEdit(rs).subscribe(item => {
                    this.input = item;
                    this._setValueForEdit();
                });
            }
        });
    }

    setCollapseAll(isCollapsed = false, excludeIdList?: number[]): void {
        for (let i = 0; i < this.groupTab.tabs.length; i++) {
            if (!excludeIdList || excludeIdList.indexOf(i) < 0) {
                this.groupTab.tabs[i].selected = isCollapsed;
            } else {
                this.groupTab.tabs[i].selected = !isCollapsed;
            }
        }

        this.collapsedAll = !isCollapsed;
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            txtHeThongGiamSat: [],
            txtPortServer: [],
            txtPublicServer: ['', { validators: [ValidationComponent.KtraIPAdress] }],
            txtPrivateServer: ['', { validators: [ValidationComponent.KtraIPAdress] }],
            txtWhistleTime: [],
            txtSpeakerTime: [],
            txtLongitude: [],
            txtLatitude: [],
            txtDiaChiIpServer: ['', { validators: [ValidationComponent.KtraIPAdress] }],
            txtPortServerCollapse: [],
            txtDiaChiIpClient: ['', { validators: [ValidationComponent.KtraIPAdress] }],
            txtPortClientCollapse: [],
            txtThuatToanOTP: [],
            txtThoiHanOTP: [],
            txtUsernameSMS: [],
            txtPasswordSMS: [],
            txtDiaChiIPSMS: ['', { validators: [ValidationComponent.KtraIPAdress] }],
            txtPortSMS: [],
            txtDauSoSMS: [],
        });
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') {
            this.saving = true;
            this._getValueForSave();
            this._cauHinhChungService.createOrEdit(this.input).pipe(
                finalize(() => {
                    this.saving = false;
                })
            ).subscribe((result) => {
                this.showUpdateMessage();
                this.onSave.emit();
            });
        }
    }

    private _getValueForSave() {
        this.input.tenHeThong = this.form.controls.txtHeThongGiamSat.value;
        this.input.port = this.form.controls.txtPortServer.value;
        this.input.publicIp = this.form.controls.txtPublicServer.value;
        this.input.privateIp = this.form.controls.txtPrivateServer.value;
        this.input.thoiGianMoCoi = this.form.controls.txtWhistleTime.value;
        this.input.thoiGianMoLoa = this.form.controls.txtSpeakerTime.value;
        this.input.kinhDo = this.form.controls.txtLongitude.value;
        this.input.viDo = this.form.controls.txtLatitude.value;
        this.input.ketNoiServerIp = this.form.controls.txtDiaChiIpServer.value;
        this.input.ketNoiServerPort = this.form.controls.txtPortServerCollapse.value;
        this.input.ketNoiClientIp = this.form.controls.txtDiaChiIpClient.value;
        this.input.ketNoiClientPort = this.form.controls.txtPortClientCollapse.value;
        this.input.thuatToanOTP = this.form.controls.txtThuatToanOTP.value;
        this.input.thoiHanOTP = this.form.controls.txtThoiHanOTP.value;
        this.input.smsUsername = this.form.controls.txtUsernameSMS.value;
        this.input.smsPassword = this.form.controls.txtPasswordSMS.value;
        this.input.smsIp = this.form.controls.txtDiaChiIPSMS.value;
        this.input.smsPort = this.form.controls.txtPortSMS.value;
        this.input.smsDauSo = this.form.controls.txtDauSoSMS.value;
    }

    private _setValueForEdit() {
        this.form.controls.txtHeThongGiamSat.setValue(this.input.tenHeThong);
        this.form.controls.txtPortServer.setValue(this.input.port);
        this.form.controls.txtPublicServer.setValue(this.input.publicIp);
        this.form.controls.txtPrivateServer.setValue(this.input.privateIp);
        this.form.controls.txtWhistleTime.setValue(this.input.thoiGianMoCoi);
        this.form.controls.txtSpeakerTime.setValue(this.input.thoiGianMoLoa);
        this.form.controls.txtLongitude.setValue(this.input.kinhDo);
        this.form.controls.txtLatitude.setValue(this.input.viDo);
        this.form.controls.txtDiaChiIpServer.setValue(this.input.ketNoiServerIp);
        this.form.controls.txtPortServerCollapse.setValue(this.input.ketNoiServerPort);
        this.form.controls.txtDiaChiIpClient.setValue(this.input.ketNoiClientIp);
        this.form.controls.txtPortClientCollapse.setValue(this.input.ketNoiClientPort);
        this.form.controls.txtThuatToanOTP.setValue(this.input.thuatToanOTP);
        this.form.controls.txtThoiHanOTP.setValue(this.input.thoiHanOTP);
        this.form.controls.txtUsernameSMS.setValue(this.input.smsUsername);
        this.form.controls.txtPasswordSMS.setValue(this.input.smsPassword);
        this.form.controls.txtDiaChiIPSMS.setValue(this.input.smsIp);
        this.form.controls.txtPortSMS.setValue(this.input.smsPort);
        this.form.controls.txtDauSoSMS.setValue(this.input.smsDauSo);
    }

}
