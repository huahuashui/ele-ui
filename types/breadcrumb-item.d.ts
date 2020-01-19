import {SnUIComponent} from './component';

/** BreadcrumbItem Component External statement */
export declare interface SnBreadcrumbItem extends SnUIComponent {
    /** 在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录 */
    replace: boolean;

    /** 路由跳转对象，同 vue-router 的 to */
    to: object;
}
