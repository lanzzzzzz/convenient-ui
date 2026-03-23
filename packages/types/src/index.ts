import type { VNodeChild } from 'vue';
import type {
    InputProps, SelectProps, DatePickerProps,
    InputNumberProps, SwitchProps, SliderProps, RateProps,
    CheckboxProps, RadioProps
} from 'element-plus';

// 1. 组件与 Props 映射表 (极致的类型推断)
export interface ComponentPropsMap {
    'input': InputProps;
    'input-number': InputNumberProps;
    'select': SelectProps;
    'select-v2': SelectProps;
    'date-picker': DatePickerProps;
    'time-picker': Record<string, any>;
    'switch': SwitchProps;
    'checkbox': CheckboxProps;
    'radio': RadioProps;
    'slider': SliderProps;
    'rate': RateProps;
    'slot': Record<string, never>;
    'selection': Record<string, never>;
    'index': Record<string, never>;
    'expand': Record<string, never>;
    'action': Record<string, never>;
}

export type ComponentType = keyof ComponentPropsMap;

// 🌟 修复 3：补全泛型推导，告别 any，让 IDE 智能提示起飞
export interface ActionSchema<Row = any> {
    label: string;
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
    onClick: (row: Row) => void;
    ifShow?: (row: Row) => boolean;
    auth?: string | string[];
    isConfirm?: boolean;
    confirmText?: string;
}

// 2. 基础字段配置 (泛型推断)
export interface FieldSchema<Row = any, T extends ComponentType = ComponentType> {
    prop: string;
    label: string;
    type?: T;
    defaultValue?: any;
    className?: string;
    formItemClass?: string;
    fieldStyle?: Record<string, string | number>;

    componentProps?: T extends keyof ComponentPropsMap ? Partial<ComponentPropsMap[T]> : Record<string, any>;

    // 🌟 修复 3：使用 Partial<Row> 推导表单模型，比 Record<string, any> 更安全
    ifShow?: (model: Partial<Row>) => boolean;

    colProps?: { span?: number; offset?: number; xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
    rules?: any[];
    serializer?: (value: any) => Record<string, any>;

    [key: string]: any;
}


export interface TableColumnSchema<Row = any, T extends ComponentType = ComponentType> extends FieldSchema<Row, T> {
    // 🌟 修复 3：将 Row 泛型向下传递给 ActionSchema
    actions?: ActionSchema<Row>[];

    width?: string | number;
    minWidth?: string | number;
    fixed?: 'left' | 'right';
    sortable?: boolean | 'custom';
    align?: 'left' | 'center' | 'right';
    search?: boolean;
    searchOrder?: number;
    render?: (scope: { row: Row; index: number }) => VNodeChild;
    headerRender?: (scope: { column: any; $index: number }) => VNodeChild;
}