import {SnUIComponent, SnUIComponentSize} from './component';

/** 选择器风格 */
export type SelectStyle = 'normal' | 'noBorderBg' | 'button';

/** SelectBase Component */
export declare interface SnSelectBase extends SnUIComponent {
    /** 下拉框选中值 */
    model: string | number | boolean;

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

    /** 下拉收起 */
    hideDropDown(): void;
}

/** SelectBase Component Internal statement */
export interface ISnSelectBase extends SnSelectBase {

}
