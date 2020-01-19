import {SnUIComponent} from './component';

/** Breadcrumb Component External statement */
export declare interface SnBreadcrumb extends SnUIComponent {
    /** 分隔符 与separatorClass互斥 */
    separator: string;

    /** 图标分隔符class，如果传入图标class，将使separator设置失效 */
    separatorClass: string;
}

/** Breadcrumb Component Internal statement */
export interface ISnBreadcrumb extends SnBreadcrumb {

}
