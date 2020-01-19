import {SnUIComponent, SnUIComponentSize} from './component';
import {SelectStyle} from "./select-base";
import {ISnSelectOption} from "./select-option";

/** 下拉框Value类型 */
export type SelectValue = string | number | boolean;

/** 下拉框Label类型 */
export type SelectLabel = string | number;

/** Select Component */
export declare interface SnSelect extends SnUIComponent {
    readonly model: SelectValue | SelectValue[];

    /** 输入框尺寸 */
    size: SnUIComponentSize;

    /** 下拉框最大高度 默认300 */
    dropHeight: number;

    /** 动态计算下拉框位置 */
    activeDrop: boolean;

    /** 占位符 */
    placeholder: string;

    /**
     * 选择器风格
     * normal:可选状态--输入框有边框及背景色，禁止状态-鼠标图标置为禁止，边框及背景色置灰
     * noBorderBg:可选状态--输入框无边框及背景色，禁止状态-鼠标图标置为禁止
     * button:可选状态--输入框边框及背景色-蓝色按钮样式，禁止状态-鼠标图标置为禁止 边框置灰-背景色置白
     * 默认normal
     */
    selectStyle: SelectStyle;

    /** 禁用 */
    disabled: boolean;

    /** 是否加载iframe 在列表中渲染的数据 不加载iframe可以极大加快渲染速度 */
    hasIframe: boolean;

    /** 是否开启多选 默认false */
    multiple: boolean;
}

/** Select Component Internal statement */
export interface ISnSelect extends SnSelect {
    /** 注册子组件更新方法 */
    addSubscriber(field: ISnSelectOption): void;

    /** 移除子组件更新方法 */
    removeSubscriber(field: ISnSelectOption): void;

    /** 更新label */
    updateLabel(label: string | number): void;

    /** 更新model/label */
    changeChoice(label: string | number, value: SelectValue): void;
}
