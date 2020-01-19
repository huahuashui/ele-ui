import Vue from 'vue';
import {SnUIComponent, SnUIComponentSize, SnUIHorizontalAlignment} from "./component";

import {SnAudio} from "./audio";
import {SnAutocomplete} from "./autocomplete";
import {SnAutocompleteBase} from "./autocomplete-base";
import {SnBadge} from "./badge";
import {SnBreadcrumb} from "./breadcrumb";
import {SnBreadcrumbItem} from "./breadcrumb-item";
import {SnButton} from "./button";
import {SnButtonGroup} from "./button-group";
import {SnCheckbox} from "./checkbox";
import {SnCheckboxGroup} from "./checkbox-group";
import {SnCollapseText} from "./collapse-text";
import {SnCopyText} from "./copy-text";
import {SnForm} from "./form";
import {SnFormItem} from "./form-item";
import {SnInput} from "./input";
import {SnPagination} from "./pagination";
import {SnPopconfirm} from "./popconfirm";
import {SnPopover} from "./popover";
import {SnProgress} from "./progress";
import {SnRadio} from "./radio";
import {SnRadioGroup} from "./radio-group";
import {SnScroll} from "./scroll";
import {SnSelect} from "./select";
import {SnSelectBase} from "./select-base";
import {SnSelectOption} from "./select-option";
import {SnSimpleLayer} from "./simple-layer";
import {SnSlider} from "./Slider";
import {SnSpiner} from "./spiner";
import {SnSwitch} from "./switch";
import {SnTab} from "./tab";
import {SnTabPane} from "./tab-pane";
import {SnTable} from "./table";
import {SnTableColumn} from "./table-column";
import {SnTooltip} from "./tooltip";
import {SnTree} from "./tree";
import {TreeDirectiveService} from "./tree-directive-service";
import {SnUpload} from "./upload";

/** The version of ele-ui */
type version = string;

/**
 * Install all ele-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(ElementUI)` to install.
 */
type install = (vue: typeof Vue, opts: any) => void;

export {
    version,
    install,
    SnUIComponent,
    SnUIComponentSize,
    SnUIHorizontalAlignment,
    SnAudio,
    SnAutocomplete,
    SnAutocompleteBase,
    SnBadge,
    SnBreadcrumb,
    SnBreadcrumbItem,
    SnButton,
    SnButtonGroup,
    SnCheckbox,
    SnCheckboxGroup,
    SnCollapseText,
    SnCopyText,
    SnForm,
    SnFormItem,
    SnInput,
    SnPagination,
    SnPopconfirm,
    SnPopover,
    SnProgress,
    SnRadio,
    SnRadioGroup,
    SnScroll,
    SnSelect,
    SnSelectBase,
    SnSelectOption,
    SnSimpleLayer,
    SnSlider,
    SnSpiner,
    SnSwitch,
    SnTab,
    SnTabPane,
    SnTable,
    SnTableColumn,
    SnTooltip,
    SnTree,
    TreeDirectiveService,
    SnUpload
}
