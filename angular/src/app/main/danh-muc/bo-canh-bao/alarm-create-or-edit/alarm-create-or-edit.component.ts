import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '../../../../../shared/app-component-base';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
    DMCanhBaoServiceProxy,
    DMMauDuLieuCamBienServiceProxy, MauDuLieuCamBienDto
} from '../../../../../shared/service-proxies/service-proxies';
import { CommonComponent } from '../../../../../shared/dft/components/common.component';
import {
    AppAlarmColor,
    AppAlarmSound,
    AppKeyFilterPredicateOperation, AppOperatorAndOr,
    AppSpecType, AppSpecUnit, AppTrueFalse
} from '../../../../../shared/AppEnums';
import {
    ICondition,
    IEntityKey,
    IKeyFilter,
    IKeyFilterPredicate,
    IOperation, Ipredicates, IServerity, ISpec,
    IValue
} from '../../../../../shared/interfaces/IServerity';

@Component({
    selector: 'app-alarm-create-or-edit',
    templateUrl: './alarm-create-or-edit.component.html',
    styleUrls: ['./alarm-create-or-edit.component.scss']
})
export class AlarmCreateOrEditComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();
    formCreateRule: FormGroup;
    arr = new FormArray([]);
    saving = false;
    isEdit = false;
    id: any;
    arrCreateRule: any[] = [];
    isView: boolean;
    dataSensor: MauDuLieuCamBienDto[] = [];
    arrCreateRulerNew = [];
    /* tslint:disable:max-classes-per-file */
    createRuleNew: {
        name: string,
        content: IServerity
    } = {
            name: '',
            content: new class implements IServerity {
                alarmDetails: string;
                color: number;
                condition: ICondition = new class implements ICondition {
                    // @ts-ignore
                    condition: [IKeyFilter] = [];
                    spec: ISpec = new class implements ISpec {
                        type: string;
                        unit: string;
                        value: number;
                    }();
                }();
                popup: boolean;
                schedule: null;
                sound: number;
            }()
        };

    khongBang = 'NOT_EQUAL';
    bang = 'EQUAL';
    colorArr: any[] = [
        { id: AppAlarmColor.RED, displayName: 'Đỏ' },
        { id: AppAlarmColor.ORANGE, displayName: 'Cam' },
        { id: AppAlarmColor.YELLOW, displayName: 'Vàng' },
        { id: AppAlarmColor.GREEN, displayName: 'Xanh' },
        { id: AppAlarmColor.GREY, displayName: 'Xám' },
    ];
    soundArr: any[] = [
        { id: AppAlarmSound.Loai_1, displayName: 'Loại 1' },
        { id: AppAlarmSound.Loai_2, displayName: 'Loại 2' },
        { id: AppAlarmSound.Loai_3, displayName: 'Loại 3' },
        { id: AppAlarmSound.Loai_4, displayName: 'Loại 4' },
        { id: AppAlarmSound.Loai_5, displayName: 'Loại 5' },
    ];
    leverArr: any[] = [
        { id: 'CRITICAL', displayName: this.l('BC_CRITICAL'), disable: true },
        { id: 'MAJOR', displayName: this.l('BC_MAJOR'), disable: false },
        { id: 'MINOR', displayName: this.l('BC_MINOR'), disable: false },
        { id: 'WARNING', displayName: this.l('BC_WARNING'), disable: false },
        { id: 'INDETERMINATE', displayName: this.l('BC_INDETERMINATE'), disable: true },
    ];
    ruleType: any[] = [
        { id: AppSpecType.SIMPLE, displayName: 'Đơn Giản' },
        { id: AppSpecType.DURATION, displayName: 'Khoảng thời gian' }
    ];
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
        { id: AppKeyFilterPredicateOperation.GREATER_OR_EQUAL, displayName: 'GREATER OR EQUAL' },
        { id: AppKeyFilterPredicateOperation.LESS_OR_EQUAL, displayName: 'LESS OR EQUAL' }
    ];
    bolleanArr: any[] = [
        { id: AppKeyFilterPredicateOperation.EQUAL, displayName: this.bang },
        { id: AppKeyFilterPredicateOperation.NOT_EQUAL, displayName: this.khongBang },
    ];
    arrOperatorAndOr: any = [
        { id: AppOperatorAndOr.AND, displayName: 'Và' },
        { id: AppOperatorAndOr.OR, displayName: 'Hoặc' }
    ];
    trueFalseArr: any[] = [
        { id: AppTrueFalse.TRUE, displayName: 'TRUE' },
        { id: AppTrueFalse.FALSE, displayName: 'FALSE' },
    ];

    constructor(
        injector: Injector,
        public bsModalRef: BsModalRef,
        private _modalService: BsModalService,
        private _fb: FormBuilder,
        private _mauDulieuCamBienService: DMMauDuLieuCamBienServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.khoiTaoForm();
        this.setDisableArrlv();
        this.getDataSensor();
        this.setValueDefault();
        if (this.id >= 0) {
            this.getDataPage();
        } else {
            // Thêm mới
            this.isEdit = false;
        }
        if (this.isView) {
            this.formCreateRule.disable();
        } else {
            this.formCreateRule.enable();
        }
    }

    khoiTaoForm() {
        this.formCreateRule = this._fb.group({
            name: new FormControl('', Validators.required),
            schedule: new FormControl(null),
            specType: new FormControl('SIMPLE'),
            specUnit: new FormControl(),
            specValue: new FormControl(),
            condition: new FormArray([]),
            alarmDetails: new FormControl(),
            popup: new FormControl(false),
            color: new FormControl('', Validators.required),
            sound: new FormControl('', Validators.required),
            operatorAndOr: new FormControl(AppOperatorAndOr.AND),
        });
    }

    getDataPage() {
        this.isEdit = true;
        this._setValueForEdit();
        this._setValueForArr();
    }

    getDataSensor() {
        this._mauDulieuCamBienService.getAllValue().subscribe(rs => {
            this.dataSensor = rs;
        });
    }

    save(): void {
        if (CommonComponent.getControlErr(this.formCreateRule) === ''
            && CommonComponent.getControlArrErr(this.arr) === '' && this.arr.controls.length !== 0) { // kiểm tra xem form có lỗi k
            this.saving = true;
            this._getValueForSave();
            this.bsModalRef.hide();
            this.onSave.emit(this.arrCreateRule);
        } else {
            const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
                '<p class="text-popup-xoa m-t-8">'
                + this.l('qlluatcanhbao_vuilongbosungtruonghopdetrong') + '</p>';
            this.swal.fire({
                html: html1,
                title: '',
                icon: 'warning',
                iconHtml: '<span class="icon1">&#9888</span>',
                showCloseButton: true,
                showCancelButton: false,
                confirmButtonColor: this.confirmButtonColor,
                cancelButtonColor: this.cancelButtonColor,
                cancelButtonText: this.l(this.cancelButtonText),
                confirmButtonText: this.l('Confirm')
            });
        }
    }

    getLength(object): number {
        return Object.keys(object).length;
    }

    close() {
        this.bsModalRef.hide();
    }

    private _setValueForEdit() {
        this.formCreateRule.controls.schedule.setValue(this.arrCreateRule[this.id].content.schedule);
        this.formCreateRule.controls.specType.setValue(this.arrCreateRule[this.id].content.condition.spec.type);
        this.formCreateRule.controls.specUnit.setValue(this.arrCreateRule[this.id].content.condition.spec.unit);
        this.formCreateRule.controls.specValue.setValue(this.arrCreateRule[this.id].content.condition.spec.value);
        this.formCreateRule.controls.alarmDetails.setValue(this.arrCreateRule[this.id].content.alarmDetails);
        this.formCreateRule.controls.popup.setValue(this.arrCreateRule[this.id].content.popup);
        this.formCreateRule.controls.color.setValue(this.arrCreateRule[this.id].content.color);
        this.formCreateRule.controls.sound.setValue(this.arrCreateRule[this.id].content.sound);
        this.formCreateRule.controls.name.setValue(this.arrCreateRule[this.id].name);
        this.formCreateRule.controls.operatorAndOr.setValue(this.arrCreateRule[this.id].content.operatorAndOr);

    }

    private _setValueForArr() {
        this.arr.controls = [];
        if (this.arrCreateRule[this.id].content.operatorAndOr === 1) {
            // @ts-ignore
            for (const value of this.arrCreateRule[this.id].content.condition.condition) {
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
        } else if (this.arrCreateRule[this.id].content.operatorAndOr === 2) {
            for (const value of this.arrCreateRule[this.id].content.condition.condition[0].predicate.predicates) {
                this.arr.controls.push(new FormGroup({
                    key: new FormControl(this.arrCreateRule[this.id].content.condition.condition[0].key.key),
                    keyType: new FormControl(this.arrCreateRule[this.id].content.condition.condition[0].key.keyType),
                    predicateType: new FormControl(value.type),
                    userValue: new FormControl(value.value.userValue),
                    defaultValue: new FormControl(value.value.defaultValue),
                    dynamicValue: new FormControl(value.value.dynamicValue),
                    operation: new FormControl(value.operation),
                    valueType: new FormControl(this.arrCreateRule[this.id].content.condition.condition[0].valueType),
                }));
            }
        }
        if (this.isView) {
            this.arr.disable();
        } else {
            this.arr.enable();
        }
    }

    private _getValueForSave() {
        if (this.id >= 0) {
            this.saveById();
        } else if (this.formCreateRule.value.operatorAndOr === 1) {
            this.createRuleNew.name = this.formCreateRule.get('name').value;
            this.createRuleNew.content.condition.spec.type = this.formCreateRule.get('specType').value;
            if (this.formCreateRule.get('specType').value === 'SIMPLE') {
                this.createRuleNew.content.condition.spec.unit = undefined;
                this.createRuleNew.content.condition.spec.value = undefined;
            } else {
                this.createRuleNew.content.condition.spec.unit = this.formCreateRule.get('specUnit').value;
                this.createRuleNew.content.condition.spec.value = this.formCreateRule.get('specValue').value;
            }
            this.createRuleNew.content.alarmDetails = this.formCreateRule.get('alarmDetails').value;
            this.createRuleNew.content.schedule = this.formCreateRule.get('schedule').value;
            this.createRuleNew.content.popup = !!this.formCreateRule.get('popup').value;
            this.createRuleNew.content.color = this.formCreateRule.get('color').value;
            this.createRuleNew.content.sound = this.formCreateRule.get('sound').value;
            this.createRuleNew.content.operatorAndOr = this.formCreateRule.get('operatorAndOr').value;
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
                this.createRuleNew.content.condition.condition.push(keyFilter);
            }
            this.arrCreateRule.push(this.createRuleNew);
        } else if (this.formCreateRule.value.operatorAndOr === 2) {
            this.createRuleNew.name = this.formCreateRule.get('name').value;
            this.createRuleNew.content.condition.spec.type = this.formCreateRule.get('specType').value;
            this.createRuleNew.content.condition.spec.unit = this.formCreateRule.get('specUnit').value;
            this.createRuleNew.content.condition.spec.value = this.formCreateRule.get('specValue').value;
            this.createRuleNew.content.alarmDetails = this.formCreateRule.get('alarmDetails').value;
            this.createRuleNew.content.schedule = this.formCreateRule.get('schedule').value;
            this.createRuleNew.content.popup = !!this.formCreateRule.get('popup').value;
            this.createRuleNew.content.color = this.formCreateRule.get('color').value;
            this.createRuleNew.content.sound = this.formCreateRule.get('sound').value;
            this.createRuleNew.content.operatorAndOr = this.formCreateRule.get('operatorAndOr').value;
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
            this.createRuleNew.content.condition.condition.push(condition);
            this.arrCreateRule.push(this.createRuleNew);
        }
    }

    saveById() {
        if (this.formCreateRule.value.operatorAndOr === 1) {
            this.arrCreateRule[this.id].name = this.formCreateRule.get('name').value;
            this.arrCreateRule[this.id].content.condition.spec.type = this.formCreateRule.get('specType').value;
            this.arrCreateRule[this.id].content.condition.spec.unit = this.formCreateRule.get('specUnit').value;
            this.arrCreateRule[this.id].content.condition.spec.value = this.formCreateRule.get('specValue').value;
            this.arrCreateRule[this.id].content.alarmDetails = this.formCreateRule.get('alarmDetails').value;
            this.arrCreateRule[this.id].content.schedule = this.formCreateRule.get('schedule').value;
            this.arrCreateRule[this.id].content.popup = !!this.formCreateRule.get('popup').value;
            this.arrCreateRule[this.id].content.color = this.formCreateRule.get('color').value;
            this.arrCreateRule[this.id].content.sound = this.formCreateRule.get('sound').value;
            this.arrCreateRule[this.id].content.operatorAndOr = this.formCreateRule.get('operatorAndOr').value;
            this.arrCreateRule[this.id].content.condition.condition = [];
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
                this.arrCreateRule[this.id].content.condition.condition.push(keyFilter);
            }
        } else if (this.formCreateRule.value.operatorAndOr === 2) {
            this.arrCreateRule[this.id].name = this.formCreateRule.get('name').value;
            this.arrCreateRule[this.id].content.condition.spec.type = this.formCreateRule.get('specType').value;
            this.arrCreateRule[this.id].content.condition.spec.unit = this.formCreateRule.get('specUnit').value;
            this.arrCreateRule[this.id].content.condition.spec.value = this.formCreateRule.get('specValue').value;
            this.arrCreateRule[this.id].content.alarmDetails = this.formCreateRule.get('alarmDetails').value;
            this.arrCreateRule[this.id].content.schedule = this.formCreateRule.get('schedule').value;
            this.arrCreateRule[this.id].content.popup = !!this.formCreateRule.get('popup').value;
            this.arrCreateRule[this.id].content.color = this.formCreateRule.get('color').value;
            this.arrCreateRule[this.id].content.sound = this.formCreateRule.get('sound').value;
            this.arrCreateRule[this.id].content.operatorAndOr = this.formCreateRule.get('operatorAndOr').value;
            this.arrCreateRule[this.id].content.condition.condition = [];
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
            // this.clearRuleFinal.condition.condition.push(condition);
            this.arrCreateRule[this.id].content.condition.condition.push(condition);
        }
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

    setOperation(i) {
        const rs = this.dataSensor.find(w => w.ten === this.arr.controls[i].value.key);
        if (this.formCreateRule.value.operatorAndOr === 1) {
            this.setValue1(rs, i);
        } else if (this.formCreateRule.value.operatorAndOr === 2) {
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

    deleteClearRule(i: number) {
        this.arr.controls.splice(i, 1);
    }

    changeName(value: any) {
        const name = value.slice(3, value.length);
        if (name === 'MAJOR') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.ORANGE);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_2);
        }
        if (name === 'MINOR') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.YELLOW);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_3);
        }
        if (name === 'WARNING') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.GREEN);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_4);
        }
        if (name === 'CRITICAL') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.RED);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_1);
        }
        if (name === 'INDETERMINATE') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.GREY);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_5);
        }
        this.setDisableArrlv(name);
    }

    setDisableArrlv(name?: string) {
        for (const valueElement of this.leverArr) {
            if (valueElement.id === name) {
                valueElement.disable = true;
            } else {
                valueElement.disable = false;
            }
        }
        for (const value of this.arrCreateRule) {
            for (const valueElement of this.leverArr) {
                if (valueElement.id === value.name) {
                    valueElement.disable = true;
                }
            }
        }
    }

    changeOperatorAndOr() {
        this.arr.controls = [];
    }

    setValueDefault() {
        for (const value of this.leverArr) {
            if (value.disable === true) {

            } else {
                this.formCreateRule.controls.name.setValue(value.id);
                this.setValueSoundAndcolor(value);
                return;
            }
        }
    }

    setValueSoundAndcolor(value) {
        if (value.id === 'MAJOR') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.ORANGE);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_2);
        }
        if (value.id === 'MINOR') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.YELLOW);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_3);
        }
        if (value.id === 'WARNING') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.GREEN);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_4);
        }
        if (value.id === 'CRITICAL') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.RED);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_1);
        }
        if (value.id === 'INDETERMINATE') {
            this.formCreateRule.controls.color.setValue(AppAlarmColor.GREY);
            this.formCreateRule.controls.sound.setValue(AppAlarmSound.Loai_5);
        }
    }

}
