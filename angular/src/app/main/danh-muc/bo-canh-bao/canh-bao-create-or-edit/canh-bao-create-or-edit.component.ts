import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
    BoCanhBaoCreateInput,
    CanhBao,
    CanhBaoCreateInput,
    DMBoCanhBaoServiceProxy,
    DMCanhBaoServiceProxy, DMMauDuLieuCamBienServiceProxy, MauDuLieuCamBienDto
} from '../../../../../shared/service-proxies/service-proxies';
import { HttpClient } from '@angular/common/http';
import { AppComponentBase } from '../../../../../shared/app-component-base';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonComponent } from '../../../../../shared/dft/components/common.component';
import { finalize } from 'rxjs/operators';
import {
    ICondition,
    IEntityKey,
    IKeyFilter,
    IKeyFilterPredicate, IOperation, Ipredicates,
    IRuler,
    IServerity, ISpec, IValue
} from '../../../../../shared/interfaces/IServerity';
import {
    AppKeyFilterPredicateOperation,
    AppOperatorAndOr,
    AppSpecType,
    AppSpecUnit, AppTrueFalse
} from '../../../../../shared/AppEnums';
import { AlarmCreateOrEditComponent } from '../alarm-create-or-edit/alarm-create-or-edit.component';
import { ValidationComponent } from '../../../../../shared/dft/components/validation-messages.component';

@Component({
    selector: 'app-canh-bao-create-or-edit',
    templateUrl: './canh-bao-create-or-edit.component.html',
    styleUrls: ['./canh-bao-create-or-edit.component.scss']
})

export class CanhBaoCreateOrEditComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();
    form: FormGroup;
    formClearRule: FormGroup;
    arr = new FormArray([]);
    saving = false;
    isEdit = false;
    canhBaoDto: CanhBaoCreateInput = new CanhBaoCreateInput();
    canhBaoCreateInput: CanhBaoCreateInput = new CanhBaoCreateInput();
    createRules: any[] = [];
    id: number;
    idDevice: number;
    isView: boolean;
    record: any;
    tenCu: string;
    rulersSelected: IRuler[] = [];
    nameRulerSelected: string[] = [];
    listCanhBao: any[];
    tbClearRule: IServerity;
    iconString = '<span class="icon1">&#9888</span>';
    conf = this.l('Are You Sure?');
    h3start = '<h3 class="title-popup-xoa m-t-24" >';
    h3end = '</h3>';
    pstart = '<p class="text-popup-xoa m-t-8">';
    pend = '</p>';
    /* tslint:disable:max-classes-per-file */
    clearRuleFinal: IServerity = new class implements IServerity {
        alarmDetails: string;
        operatorAndOr: number;
        condition: ICondition = new class implements ICondition {
            // @ts-ignore
            condition: [IKeyFilter] = [];
            spec: ISpec = new class implements ISpec {
                type: string;
                unit: string;
                value: number;
            }();
        }();
        schedule: null;
    }();
    dataSensor: MauDuLieuCamBienDto[] = [];

    ruleType: any[] = [
        { id: AppSpecType.SIMPLE, displayName: 'Đơn Giản' },
        { id: AppSpecType.DURATION, displayName: 'Khoảng thời gian' }
    ];
    arrOperatorAndOr: any = [
        { id: AppOperatorAndOr.AND, displayName: 'Và' },
        { id: AppOperatorAndOr.OR, displayName: 'Hoặc' }
    ];
    khongBang = 'NOT_EQUAL';
    bang = 'EQUAL';
    timeType: any[] = [
        { id: AppSpecUnit.SECONDS, displayName: 'Giây' },
        { id: AppSpecUnit.MINUTES, displayName: 'Phút' },
        { id: AppSpecUnit.HOURS, displayName: 'Giờ' },
        { id: AppSpecUnit.DAYS, displayName: 'Ngày' },
    ];
    stringArr: any[] = [
        { id: AppKeyFilterPredicateOperation.NOT_EQUAL, displayName: this.khongBang },
        { id: AppKeyFilterPredicateOperation.EQUAL, displayName: this.bang },
        { id: AppKeyFilterPredicateOperation.STARTS_WITH, displayName: 'STARTS_WITH' },
        { id: AppKeyFilterPredicateOperation.ENDS_WITH, displayName: 'ENDS_WITH' },
        { id: AppKeyFilterPredicateOperation.CONTAINS, displayName: 'CONTAINS' },
        { id: AppKeyFilterPredicateOperation.NOT_CONTAINS, displayName: 'NOT_CONTAINS' }
    ];
    numberArr: any[] = [
        { id: AppKeyFilterPredicateOperation.EQUAL, displayName: this.bang },
        { id: AppKeyFilterPredicateOperation.NOT_EQUAL, displayName: this.khongBang },
        { id: AppKeyFilterPredicateOperation.GREATER, displayName: 'GREATER' },
        { id: AppKeyFilterPredicateOperation.LESS, displayName: 'LESS' },
        { id: AppKeyFilterPredicateOperation.GREATER_OR_EQUAL, displayName: 'GREATER_OR_EQUAL' },
        { id: AppKeyFilterPredicateOperation.LESS_OR_EQUAL, displayName: 'LESS_OR_EQUAL' }
    ];
    bolleanArr: any[] = [
        { id: AppKeyFilterPredicateOperation.EQUAL, displayName: this.bang },
        { id: AppKeyFilterPredicateOperation.NOT_EQUAL, displayName: this.khongBang },
    ];
    trueFalseArr: any[] = [
        { id: AppTrueFalse.TRUE, displayName: 'TRUE' },
        { id: AppTrueFalse.FALSE, displayName: 'FALSE' },
    ];
    bangomau = {
        '1': 'o-mau-do',
        '2': 'o-mau-cam',
        '3': 'o-mau-vang',
        '4': 'o-mau-xanh',
        '5': 'o-mau-xam',
    };
    arrSort = ['CRITICAL', 'MAJOR', 'MINOR', 'WARNING', 'INDETERMINATE'];

    // backUp;

    constructor(
        injector: Injector,
        private _fb: FormBuilder,
        public http: HttpClient,
        public bsModalRef: BsModalRef,
        private _canhBaoService: DMCanhBaoServiceProxy,
        private _mauDulieuCamBienService: DMMauDuLieuCamBienServiceProxy,
        private _modalService: BsModalService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.khoiTaoForm();
        this.getDataSensor();
        if (this.id) {
            this.getDataPage2();
        } else if (this.idDevice && this.record) {
            this.getDataPage2();
        } else {
            // Thêm mới
            this.canhBaoDto = new CanhBaoCreateInput();
            this.isEdit = false;
        }
        if (this.isView) {
            this.formClearRule.disable();
            this.form.disable();
        } else {
            this.formClearRule.enable();
            this.form.enable();
        }
        this.tenCu = this.record?.tbAlarmType;
    }

    khoiTaoForm() {
        this.form = this._fb.group({
            id: [''],
            alarmType: ['', [Validators.required, ValidationComponent.KtraKhoangTrang]],
            clearRule: [''],
            propagate: [false],
            createRules: [''],
            description: ['']
        });
        this.formClearRule = this._fb.group({
            schedule: new FormControl(),
            specType: new FormControl('SIMPLE'),
            specUnit: new FormControl(),
            specValue: new FormControl(),
            condition: new FormArray([]),
            alarmDetails: new FormControl(),
            operatorAndOr: new FormControl(AppOperatorAndOr.AND),
        });
    }

    getDataPage2() {
        this.canhBaoDto = this.record;
        const tbNewCreateRules = JSON.parse(JSON.stringify(this.record.tbCreateRules));
        this.tbClearRule = JSON.parse((this.canhBaoDto.tbClearRule));
        this.createRules = [];
        for (const property in tbNewCreateRules) {
            if (tbNewCreateRules.hasOwnProperty(property)) {
                const ruler = {
                    name: property,
                    content: tbNewCreateRules[property],
                    index: this.arrSort.indexOf(property)
                };
                this.createRules.push(ruler);
            }
        }
        this.createRules.sort((a, b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0));
        this._setValueForEdit();
        this._setValueForClearRule();
        this._setValueForArr();
    }

    getDataPage() {
        this.isEdit = true;
        this.canhBaoDto = this.record;
        const tbNewCreateRules = JSON.parse(JSON.stringify(this.canhBaoDto['tbCreateRules']));
        this.tbClearRule = JSON.parse(JSON.stringify(this.canhBaoDto['tbClearRule']));
        this.createRules = [];
        for (const property in tbNewCreateRules) {
            if (tbNewCreateRules.hasOwnProperty(property)) {
                const ruler = {
                    name: property,
                    content: tbNewCreateRules[property],
                    index: this.arrSort.indexOf(property)
                };
                this.createRules.push(ruler);
            }
        }
        this.createRules.sort((a, b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0));
        this._setValueForEdit();
        this._setValueForClearRule();
        this._setValueForArr();

    }

    getDataSensor() {
        this._mauDulieuCamBienService.getAllValue().subscribe(rs => {
            this.dataSensor = rs;
        });
    }

    setOperation(i) {
        const rs = this.dataSensor.find(w => w.ten === this.arr.controls[i].value.key);
        if (this.formClearRule.value.operatorAndOr === 1) {
            this.setValue1(rs, i);
        } else if (this.formClearRule.value.operatorAndOr === 2) {
            this.setValue2(rs, i);
        }
    }

    setValue1(rs, i) {
        if (rs.kieuDuLieuHienthi === 'String' || rs.kieuDuLieuHienthi === 'Json') {
            // @ts-ignore
            this.arr.controls[i].controls.predicateType.setValue('STRING');
            // @ts-ignore
            this.arr.controls[i].controls.valueType.setValue('STRING');
            // @ts-ignore
            this.arr.controls[i].controls.defaultValue.setValue('0');
        }
        if (rs.kieuDuLieuHienthi === 'Long' || rs.kieuDuLieuHienthi === 'Double') {
            // @ts-ignore
            this.arr.controls[i].controls.predicateType.setValue('NUMERIC');
            // @ts-ignore
            this.arr.controls[i].controls.valueType.setValue('NUMERIC');
            // @ts-ignore
            this.arr.controls[i].controls.defaultValue.setValue(0);
        }
        if (rs.kieuDuLieuHienthi === 'Boolean') {
            // @ts-ignore
            this.arr.controls[i].controls.predicateType.setValue('BOOLEAN');
            // @ts-ignore
            this.arr.controls[i].controls.valueType.setValue('BOOLEAN');
            // @ts-ignore
            this.arr.controls[i].controls.defaultValue.setValue(AppTrueFalse.TRUE);
        }
    }


    setValue2(rs, i) {
        for (const r of this.arr.controls) {
            // @ts-ignore
            r.controls.key.setValue(this.arr.controls[i].value.key);
            if (rs.kieuDuLieuHienthi === 'String' || rs.kieuDuLieuHienthi === 'Json') {
                // @ts-ignore
                r.controls.predicateType.setValue('STRING');
                // @ts-ignore
                r.controls.valueType.setValue('STRING');
                // @ts-ignore
                r.controls.defaultValue.setValue('0');
            }
            if (rs.kieuDuLieuHienthi === 'Long' || rs.kieuDuLieuHienthi === 'Double') {
                // @ts-ignore
                r.controls.predicateType.setValue('NUMERIC');
                // @ts-ignore
                r.controls.valueType.setValue('NUMERIC');
                // @ts-ignore
                r.controls.defaultValue.setValue(0);
            }
            if (rs.kieuDuLieuHienthi === 'Boolean') {
                // @ts-ignore
                r.controls.predicateType.setValue('BOOLEAN');
                // @ts-ignore
                r.controls.valueType.setValue('BOOLEAN');
                // @ts-ignore
                r.controls.defaultValue.setValue(AppTrueFalse.TRUE);
            }
        }
    }

    private _setValueForEdit() {
        this.form.controls.id.setValue(this.canhBaoDto.id);
        this.form.controls.alarmType.setValue(this.canhBaoDto.tbAlarmType);
        this.form.controls.clearRule.setValue(this.canhBaoDto.tbClearRule);
        this.form.controls.createRules.setValue(this.canhBaoDto.tbCreateRules);
        this.form.controls.description.setValue(this.canhBaoDto.ghiChu);
    }

    private _getValueForSave() {
        this._getValueForClearRule();
        if (this.id === null) {
            this.canhBaoCreateInput.id = -1;
        } else {
            this.canhBaoCreateInput.id = this.id;
        }
        this.canhBaoCreateInput.tbAlarmType = this.form.controls.alarmType.value.replace(/\s+/g, ' ').trim();
        this.canhBaoCreateInput.ghiChu = this.form.controls.description.value.replace(/\s+/g, ' ').trim();
        if (this.form.controls.createRules.value === '') {
            this.canhBaoCreateInput.tbCreateRules = '{}';
        } else {
            this.canhBaoCreateInput.tbCreateRules = this.form.controls.createRules.value;
        }
        if (JSON.stringify(this.clearRuleFinal) === '') {
            this.canhBaoCreateInput.tbClearRule = '{}';
        } else {
            this.canhBaoCreateInput.tbClearRule = JSON.stringify(this.clearRuleFinal);
        }
        this._setValueForCreateRuler();
        this.canhBaoCreateInput.boCanhBaoId = this.idDevice;
        this.canhBaoCreateInput.tbId = this.canhBaoDto.tbId;
    }

    private _setValueForCreateRuler() {
        const arr = [];
        this.createRules.forEach(item => {
            const name = item.name;
            const content = item.content;
            if (name === 'MAJOR') {
                const dictionary = {
                    'MAJOR': content
                };
                arr.push(dictionary);
            }
            if (name === 'MINOR') {
                const dictionary = {
                    'MINOR': content
                };
                arr.push(dictionary);
            }
            if (name === 'WARNING') {
                const dictionary = {
                    'WARNING': content
                };
                arr.push(dictionary);
            }
            if (name === 'CRITICAL') {
                const dictionary = {
                    'CRITICAL': content
                };
                arr.push(dictionary);
            }
            if (name === 'INDETERMINATE') {
                const dictionary = {
                    'INDETERMINATE': content
                };
                arr.push(dictionary);
            }

        });

        const object = arr.reduce((result, item) => {
            const key = Object.keys(item)[0];
            result[key] = item[key];
            return result;
        }, {});
        const value = JSON.parse(JSON.stringify(object));
        this.canhBaoCreateInput.tbCreateRules = value;
    }

    private _setValueForClearRule() {
        this.formClearRule.controls.schedule.setValue(this.tbClearRule.schedule);
        this.formClearRule.controls.specType.setValue(this.tbClearRule.condition.spec.type);
        this.formClearRule.controls.specUnit.setValue(this.tbClearRule.condition.spec.unit);
        this.formClearRule.controls.specValue.setValue(this.tbClearRule.condition.spec.value);
        this.formClearRule.controls.alarmDetails.setValue(this.tbClearRule.alarmDetails);
        this.formClearRule.controls.operatorAndOr.setValue(this.tbClearRule.operatorAndOr);
    }

    private _setValueForArr() {
        this.arr.controls = [];
        if (this.tbClearRule.operatorAndOr === 1) {
            for (const value of this.tbClearRule.condition.condition) {
                this.arr.controls.push(new FormGroup({
                    key: new FormControl(value.key.key),
                    keyType: new FormControl(value.key.type),
                    predicateType: new FormControl(value.predicate.type),
                    userValue: new FormControl(value.predicate.value.userValue),
                    defaultValue: new FormControl(value.predicate.value.defaultValue),
                    dynamicValue: new FormControl(value.predicate.value.dynamicValue),
                    operation: new FormControl(value.predicate.operation),
                    valueType: new FormControl(value.valueType),
                }));
            }
        } else if (this.tbClearRule.operatorAndOr === 2) {
            for (const value of this.tbClearRule.condition.condition[0].predicate.predicates) {
                this.arr.controls.push(new FormGroup({
                    key: new FormControl(this.tbClearRule.condition.condition[0].key.key),
                    keyType: new FormControl(this.tbClearRule.condition.condition[0].key.type),
                    userValue: new FormControl(value.value.userValue),
                    defaultValue: new FormControl(value.value.defaultValue),
                    dynamicValue: new FormControl(value.value.dynamicValue),
                    predicateType: new FormControl(value.type),
                    operation: new FormControl(value.operation),
                    valueType: new FormControl(this.tbClearRule.condition.condition[0].valueType),
                }));
            }
        }

        if (this.isView) {
            this.arr.disable();
        } else {
            this.arr.enable();
        }
    }

    private _getValueForClearRule() {
        // luu gia tri vao object tb clear rule
        if (this.formClearRule.value.operatorAndOr === 1) {
            this.clearRuleFinal.schedule = null;
            this.clearRuleFinal.alarmDetails = null;
            this.clearRuleFinal.operatorAndOr = this.formClearRule.value.operatorAndOr;
            this.clearRuleFinal.condition.spec.type = this.formClearRule.value.specType;
            this.clearRuleFinal.condition.spec.unit = this.formClearRule.value.specUnit;
            this.clearRuleFinal.condition.spec.value = this.formClearRule.value.specValue;
            for (const value of this.arr.controls) {
                const keyFilter: IKeyFilter = new class implements IKeyFilter {
                    key: IEntityKey = new class implements IEntityKey {
                        key: string;
                        type: string;
                    }();
                    predicate: IKeyFilterPredicate = new class implements IKeyFilterPredicate {
                        operation: IOperation = new class implements IOperation {
                            type: string;
                            values: string;
                        }();
                        type: string;
                        value: IValue = new class implements IValue {
                            defaultValue: any;
                            dynamicValue: null;
                            userValue: null;
                        }();
                    }();
                    valueType: string;
                }();
                keyFilter.key.key = value.value.key;
                keyFilter.key.type = 'TIME_SERIES';
                keyFilter.predicate.type = value.value.predicateType;
                keyFilter.predicate.value.userValue = null;
                keyFilter.predicate.value.defaultValue = value.value.defaultValue;
                keyFilter.predicate.value.dynamicValue = null;
                keyFilter.predicate.operation = value.value.operation;
                keyFilter.valueType = value.value.valueType;
                this.clearRuleFinal.condition.condition.push(keyFilter);
            }
        } else {
            this.clearRuleFinal.schedule = null;
            this.clearRuleFinal.alarmDetails = null;
            this.clearRuleFinal.operatorAndOr = this.formClearRule.value.operatorAndOr;
            this.clearRuleFinal.condition.spec.type = this.formClearRule.value.specType;
            this.clearRuleFinal.condition.spec.unit = this.formClearRule.value.specUnit;
            this.clearRuleFinal.condition.spec.value = this.formClearRule.value.specValue;
            const predicate = {
                type: 'COMPLEX',
                operation: 'OR',
                predicates: []
            };
            for (const value of this.arr.controls) {
                const keyFilter: Ipredicates = new class implements Ipredicates {
                    ignoreCase: boolean;
                    operation: IOperation = new class implements IOperation {
                        type: string;
                        values: string;
                    }();
                    type: string;
                    value: IValue = new class implements IValue {
                        defaultValue: any;
                        dynamicValue: null;
                        userValue: null;
                    }();
                }();
                keyFilter.type = value.value.predicateType;
                keyFilter.value.userValue = null;
                keyFilter.value.defaultValue = value.value.defaultValue;
                keyFilter.value.dynamicValue = null;
                keyFilter.operation = value.value.operation;
                predicate.predicates.push(keyFilter);
            }
            const condition = {
                key: {
                    key: '',
                    type: 'TIME_SERIES',
                },
                predicate: {},
                valueType: ''
            };
            condition.key.key = this.arr.controls[0].value.key;
            condition.predicate = predicate;
            condition.valueType = this.arr.controls[0].value.valueType;
            // @ts-ignore
            this.clearRuleFinal.condition.condition.push(condition);
        }

    }


    close() {
        this.bsModalRef.hide();
    }

    save(): void {
        if (CommonComponent.getControlErr(this.form) === '') {
            // kiểm tra xem form có lỗi k
            this._getValueForSave();
            if (this.tenCu !== this.canhBaoCreateInput.tbAlarmType &&
                this.listCanhBao?.find(e => e.tbAlarmType === this.canhBaoCreateInput.tbAlarmType) !== undefined) {
                    const html2 =  this.h3start + '' + this.h3end +
                    this.pstart + this.l('qlluatcanhbao_tentruonghopcanhbaodatontai') + this.pend;
                this.swal.fire({
                    html: html2,
                    icon: 'warning',
                    iconHtml: this.iconString,
                    showCloseButton: true,
                    showCancelButton: false,
                    confirmButtonColor: this.confirmButtonColor,
                    cancelButtonColor: this.cancelButtonColor,
                    cancelButtonText: this.l(this.cancelButtonText),
                    confirmButtonText: this.l('Confirm')
                });
            } else if (this.createRules.length === 0) {
                const html2 =  this.h3start + '' + this.h3end +
                this.pstart + this.l('qlluatcanhbao_vuilongbosungtruonghopdetrong') + this.pend;
                this.swal.fire({
                    html: html2,
                    icon: 'warning',
                    iconHtml: this.iconString,
                    showCloseButton: true,
                    showCancelButton: false,
                    confirmButtonColor: this.confirmButtonColor,
                    cancelButtonColor: this.cancelButtonColor,
                    cancelButtonText: this.l(this.cancelButtonText),
                    confirmButtonText: this.l('Confirm')
                });
            } else {
                const value = {
                    'canhBao': this.canhBaoCreateInput,
                    'record': this.record,
                    'tenCu': this.tenCu,
                };
                this.onSave.emit(value);
                this.bsModalRef.hide();
            }

        }
    }

    deleteRules() {
        this.rulersSelected.forEach(item => {
            this.nameRulerSelected.push(item.name);
        });
        const html2 =  this.h3start + this.conf + this.h3end +
        this.pstart + this.l('qlcanhbaotram_luat') + this.nameRulerSelected.join(', ') + this.l('isdeleted') + this.pend;
        this.swal.fire({
            html: html2,
            icon: 'warning',
            iconHtml: this.iconString,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: this.confirmButtonColor,
            cancelButtonColor: this.cancelButtonColor,
            cancelButtonText: this.l(this.cancelButtonText),
            confirmButtonText: this.l(this.deleteButtonText)
        }).then((result) => {
            if (result.value) {
                this.rulersSelected.forEach(item => {
                    const index = this.createRules.indexOf(item);
                    this.createRules.splice(index, 1);
                });
                this.rulersSelected = [];
                this.nameRulerSelected = [];
            } else {
                this.rulersSelected = [];
                this.nameRulerSelected = [];
            }
        });
    }

    addNewCreateRule() {
        this.arr.controls.push(new FormGroup({
            key: new FormControl('', Validators.required),
            keyType: new FormControl('TIME_SERIES'),
            predicateType: new FormControl('NUMERIC'),
            userValue: new FormControl(''),
            defaultValue: new FormControl(0),
            dynamicValue: new FormControl(''),
            operation: new FormControl('EQUAL'),
            valueType: new FormControl('NUMERIC'),
        }));
    }


    deleteClearRule(i: number) {
        this.arr.controls.splice(i, 1);
    }

    showCreateOrEditCreateRule(id?: number, isView = false, arrCreateRule?: any): void {
        // copy
        let createOrEditUserDialog: BsModalRef;
        createOrEditUserDialog = this._modalService.show(
            AlarmCreateOrEditComponent,
            {
                class: 'modal-xl',
                ignoreBackdropClick: true,
                initialState: {
                    id,
                    isView,
                    arrCreateRule,
                },
            }
        );
        // ouput emit
        createOrEditUserDialog.content.onSave.subscribe((value) => {
            this.createRules = value;
        });
    }

    createCreateRule(value?: number) {
        this.showCreateOrEditCreateRule(this.createRules.indexOf(value), this.isView, this.createRules);
    }

    changeOperatorAndOr() {
        this.arr.controls = [];
    }

    check(condition: any) {
        if (condition.predicate.operation === 'OR') {
            return true;
        } else {
            return false;
        }
    }

    checkCreate() {
        if (this.createRules.length < 5) {
            if (this.isView) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    checkDelete() {
        if (this.rulersSelected.length === 0) {
            return true;
        } else {
            return this.isView;
        }
    }
}
