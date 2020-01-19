<template>
    <div class="sn-checkbox-group">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Model} from "vue-property-decorator";
    import {CheckboxGroupModel} from "../../../types/checkbox-group";

    @Component({
        name: "SnCheckboxGroup"
    })
    export default class SnCheckboxGroup extends Vue {
        /** 绑定值 */
        @Model('change')
        public model: CheckboxGroupModel[];

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 修改值 */
        public changeModel(value: number | string | boolean, prop: number | string) {
            let checkedList: CheckboxGroupModel[] = Array.isArray(this.model) ? this.model : [];
            checkedList = checkedList.filter(item => item.prop !== prop);
            checkedList.push({prop, value});
            this.$emit('change', checkedList);
        }
    }
</script>
