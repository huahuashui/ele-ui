import "../packages/theme-chalk";

import SnSlider from "../packages/slider";
import SnButton from "../packages/button";
import SnButtonGroup from "../packages/button-group";
import SnForm from "../packages/form";
import SnFormItem from "../packages/form-item";
import SnInput from "../packages/input";
import SnBadge from "../packages/badge";
import SnProgress from "../packages/progress";
import SnTab from "../packages/tab";
import SnTabPane from "../packages/tab-pane";
import SnBreadcrumb from "../packages/breadcrumb";
import SnBreadcrumbItem from "../packages/breadcrumb-item";
import SnRadio from "../packages/radio";
import SnRadioGroup from "../packages/radio-group";
import SnCheckbox from "../packages/checkbox";
import SnCheckboxGroup from "../packages/checkbox-group";
import SnScroll from "../packages/scroll";
import SnAudio from "../packages/audio";
import SnCopyText from "../packages/copy-text";
import SnPagination from "../packages/pagination";
import SnSelectBase from "../packages/select-base";
import SnSelect from "../packages/select";
import SnSelectOption from "../packages/select-option";
import SnTable from "../packages/table";
import SnTableColumn from "../packages/table-column";
import SnSwitch from "../packages/switch";
import SnUpload from "../packages/upload";
import SnPopover from "../packages/popover";
import SnPopconfirm from "../packages/popconfirm";
import SnTooltip from "../packages/tooltip";
import SnTree from "../packages/tree";
import TreeDirectiveService from "../packages/tree-service";
import SnAutocomplete from "../packages/autocomplete";
import SnAutocompleteBase from "../packages/autocomplete-base";
import SnCollapseText from "../packages/collapse-text";
import SnSimpleLayer from "../packages/simple-layer";
import SnSpiner from "../packages/spiner";

const components = [
    SnSlider,
    SnButton,
    SnButtonGroup,
    SnForm,
    SnFormItem,
    SnInput,
    SnBadge,
    SnProgress,
    SnTab,
    SnTabPane,
    SnBreadcrumb,
    SnBreadcrumbItem,
    SnRadio,
    SnRadioGroup,
    SnCheckbox,
    SnCheckboxGroup,
    SnScroll,
    SnAudio,
    SnCopyText,
    SnPagination,
    SnSelectBase,
    SnSelect,
    SnSelectOption,
    SnTable,
    SnTableColumn,
    SnSwitch,
    SnUpload,
    SnPopover,
    SnPopconfirm,
    SnTooltip,
    SnTree,
    SnAutocomplete,
    SnAutocompleteBase,
    SnCollapseText,
    SnSpiner
];

// vue插件初始化方法
const install = function (Vue: any, opts: any = {}) {
    components.forEach((component: any) => {
        const name = component.options ? component.options.name : component.name;
        Vue.component(name, component);
    });
};

export default {
    version: '1.0.2',
    install,
    SnSlider,
    SnButton,
    SnButtonGroup,
    SnForm,
    SnFormItem,
    SnInput,
    SnBadge,
    SnProgress,
    SnTab,
    SnTabPane,
    SnBreadcrumb,
    SnBreadcrumbItem,
    SnRadio,
    SnRadioGroup,
    SnCheckbox,
    SnCheckboxGroup,
    SnScroll,
    SnAudio,
    SnCopyText,
    SnPagination,
    SnSelectBase,
    SnSelect,
    SnSelectOption,
    SnTable,
    SnTableColumn,
    SnSwitch,
    SnUpload,
    SnPopover,
    SnPopconfirm,
    SnTooltip,
    SnTree,
    SnCollapseText,
    SnSpiner,
    // todo
    SnAutocomplete,
    // todo
    SnAutocompleteBase,


    // 非组件-放在此处后
    TreeDirectiveService,
    SnSimpleLayer
}
