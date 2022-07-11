export interface IServerity {
    schedule: null,
    condition: ICondition,
    alarmDetails: string,
    popup?: boolean,
    color?: number,
    sound?: number,
    operatorAndOr?: number
}

export interface ICondition {
    spec: ISpec,
    condition: [IKeyFilter],
}

export interface ISpec {
    type: string,
    unit?: string,
    value?: number
}

export interface IKeyFilter {
    key: IEntityKey,
    predicate: IKeyFilterPredicate,
    valueType: string,
}

export interface IEntityKey {
    key: string, // input text, tên của telemetry
    type: string,
}

export interface IKeyFilterPredicate {
    type: string, // lay theo kieu cua KeyFilter.valueType
    value?: IValue,
    predicates?: [Ipredicates],
    operation: IOperation,
    ignoreCase?: boolean, // chỉ dùng khi KeyFilter.valueType = BOOLEAN
}

export interface Ipredicates{
    type: string, // lay theo kieu cua KeyFilter.valueType
    value: IValue,
    operation: IOperation,
    ignoreCase?: boolean,
}

export interface IOperation {
    type: string,
    values: string,
}

export interface IValue {
    userValue: null,  // ko dùng, giữ nguyên khi truyền
    defaultValue: any,    // kiểu phụ thuộc vào KeyFilter.valueType
    dynamicValue: null // ko dùng, giữ nguyên khi truyền
}

export interface IAlarm {
    id: string, // smartsite tự tạo uuid
    alarmType: string, // trường này sẽ có trong bản tin cảnh báo, trường này phải là duy nhất
    createRules: {
        [key: string]: IServerity;
    },
    clearRule: IServerity,
    propagate: true,
}
export interface IDeviceProfile {
    alarms: [IAlarm],
    configuration: { type: "DEFAULT" }, // giữ nguyên gửi sang TB
    provisionConfiguration: { type: "DISABLED", provisionDeviceSecret: null }, // giữ nguyên gửi sang TB
    transportConfiguration: { type: "DEFAULT" } // giữ nguyên gửi sang TB
}

export interface IRuler {
    name: string,
    content: any
}
