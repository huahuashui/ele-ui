/*

/!**
 * Created by dell on 2017/4/11.
 *!/
export default class PageParams {
    public currentPage: number = 1; // 页码数
    public pageSize: number = 50; // 单页显示的行数
    public totalCount: number = 0; // 总数据条数(需要除以pageSize转换为页数)
    public pageCount: number = 1; // 总页数
    constructor(option: { currentPage?: number, pageSize?: number, totalCount?: number } = {}) {
        this.update(option);
    }
    public update(option: { currentPage?: number, pageSize?: number, totalCount?: number } = {}) {
        const {
            currentPage = this.currentPage,
            pageSize = this.pageSize,
            totalCount = 0
        } = option;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.updatePageCount();
    }
    public setTotalCount(totalCount: number) {
        this.totalCount = totalCount > 0 ? totalCount : 0;
        this.updatePageCount();
    }

    public setCurrentPage(currentPage: number) {
        this.currentPage = currentPage > 0 ? currentPage : 1;
    }

    public setPageSize(pageSize: number) {
        this.pageSize = pageSize > 0 ? pageSize : 50;
        this.updatePageCount();
    }

    private updatePageCount() {
        const totalCount = this.totalCount;
        const pageSize = this.pageSize;
        const _pageCount = 1;
        if (totalCount > 0) {
            let _pageCount = parseInt(totalCount / pageSize + "", 10);
            if (totalCount % pageSize !== 0) {
                _pageCount += 1;
            }
            this.pageCount = _pageCount;
        }
    }
}

export enum PageStyleType {
    small = "small",
    normal = "normal",
    middle = "middle",
}
*/
