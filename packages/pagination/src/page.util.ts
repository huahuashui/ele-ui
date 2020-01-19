/*
import {default as PageParams,PageStyleType} from "./page-params";

export class PageUtil {
    public static getInstance() {
        if (PageUtil.INSTANCE === null) {
            PageUtil.INSTANCE = new PageUtil();
        }
        return PageUtil.INSTANCE;
    }
    private static INSTANCE: PageUtil = null;

    /!**
     * 获得用于界面显示的页码列表, normal模式
     * @param params { pageCount: 总页数, currentPage: 当前页, pageStyleType: PageStyleType }
     * @return {value:number} []
     *!/
    public getPageBtns(params: { pageCount: number, currentPage: number, pageStyleType: PageStyleType }) {
        const {
            pageCount,
            currentPage,
            pageStyleType
        } = params;
        let result = [] as { value: number }[];
        if (pageStyleType === PageStyleType.small) {// 显示3个页码按钮
            result = this.computePages(pageCount, currentPage, 3)
        } else {// 显示5个页码按钮
            result = this.computePages(pageCount, currentPage, 5)
        }
        return result;
    }
    /!**
     * 根据分页参数计算可分的页数
     * @param {PageParams} origin
     * @returns {PageParams}
     *!/
    public convertPageParams(origin: PageParams) {
        const {pageSize, totalCount} = origin;
        if (totalCount % pageSize == 0) {
            origin.pageCount = parseInt(totalCount / pageSize + "", 10);
        } else {
            origin.pageCount = parseInt(totalCount / pageSize + "", 10) + 1;
        }
        return origin;
    }
    /!**
     *计算显示的页码
     * @param pageCount
     * @param currentPage
     * @param maxCount
     * @returns {{value: number}[]}
     *!/
    private computePages(pageCount: number, currentPage: number, maxCount: number): {value:number}[] {
        let i, len;
        const pages = [] as number[];
        const middleCount = Math.ceil(maxCount / 2);
        if (pageCount < maxCount) {
            for (i = 1, len = pageCount; i <= len; i++) {
                pages.push(i);
            }
        } else if (currentPage >= middleCount && currentPage <= pageCount - middleCount) {
            for (i = 1; i <= maxCount; i++) {
                pages.push(currentPage - middleCount + i);
            }
        } else if (currentPage > pageCount - middleCount && pageCount >= maxCount) {
            for (i = 1; i <= maxCount; i++) {
                pages.push(pageCount - maxCount + i);
            }
        } else {
            for (i = 1; i <= maxCount; i++) {
                pages.push(i);
            }
        }
        return pages.map(val => {
            return {value: val}
        });
    }
}
*/
