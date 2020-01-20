import {RouteConfig} from "vue-router";

const routerTree = [
    {
        name: "installation",
        path: "/installation",
        component: () => import(("../views/installation/index.md"))
    },
    {
        name: "sliderDemo",
        path: "/sliderDemo",
        component: () => import(("../views/slider-demo/index.vue")),
    },
    {
        name: "buttonDemo",
        path: "/buttonDemo",
        component: () => import(("../views/button-demo/index.vue")),
    },
    {
        name: "formDemo",
        path: "/formDemo",
        component: () => import(("../views/form-demo/index.vue")),
    },
    {
        name: "inputDemo",
        path: "/inputDemo",
        component: () => import(("../views/input-demo/index.vue")),
    },
    {
        name: "badgeDemo",
        path: "/badgeDemo",
        component: () => import(("../views/badge-demo/index.vue")),
    },
    {
        name: "breadcrumbDemo",
        path: "/breadcrumbDemo",
        component: () => import(("../views/breadcrumb-demo/index.vue")),
    },
    {
        name: "checkboxDemo",
        path: "/checkboxDemo",
        component: () => import(("../views/checkbox-demo/index.vue")),
    },
    {
        name: "radioDemo",
        path: "/radioDemo",
        component: () => import(("../views/radio-demo/index.vue")),
    },
    {
        name: "selectDemo",
        path: "/selectDemo",
        component: () => import(("../views/select-demo/index.vue")),
    },
    {
        name: "tabDemo",
        path: "/tabDemo",
        component: () => import(("../views/tab-demo/index.vue")),
    },
    {
        name: "progressDemo",
        path: "/progressDemo",
        component: () => import(("../views/progress-demo/index.vue")),
    },
    {
        name: "scrollDemo",
        path: "/scrollDemo",
        component: () => import(("../views/scroll-demo/index.md")),
    },
    {
        name: "test",
        path: "/test",
        component: () => import(("../views/md-demo/index.md")),
        // 单括号ts会报错TS2307，不清楚原因
        // component: () => import("../views/md-demo/index.md"),
    },
    {
        name: 'audioDemo',
        path: '/audioDemo',
        component: ()=> import(("../views/audio-demo/index.md"))
    },
    {
        name: "copyTextDemo",
        path: "/copyTextDemo",
        component: () => import(("../views/copy-text-demo/index.md")),
    },
    {
        name: "paginationDemo",
        path: "/paginationDemo",
        component: () => import(("../views/pagination-demo/index.vue")),
    },
    {
        name: "collapseTextDemo",
        path: "/collapseTextDemo",
        component: () => import(("../views/collapse-text-demo/collapse-text-demo.vue")),
    },
    {
        name: "tableDemo",
        path: "/tableDemo",
        component: () => import(("../views/table-demo/index.vue")),
    },
    {
        name: "switchDemo",
        path: "/switchDemo",
        component: () => import(("../views/switch-demo/index.vue")),
    },
    {
        name: "uploadDemo",
        path: "/uploadDemo",
        component: () => import(("../views/upload-demo/index.vue")),
    },
    {
        name: "treeDemo",
        path: "/treeDemo",
        component: () => import(("../views/tree-demo/index.md")),
    },
    {
        name: "autocompleteDemo",
        path: "/autocompleteDemo",
        component: () => import(("../views/autocomplete-demo/index.md"))
    }
] as RouteConfig[];

// 默认跳转路由-需根据路由配置第一项生成
const defaultRouter = {
    path: '*',
    redirect: routerTree[0].path
};

const routes = [].concat(defaultRouter, routerTree);

export {
    routes,
    routerTree
};
