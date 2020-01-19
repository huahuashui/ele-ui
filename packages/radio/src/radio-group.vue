<template>
    <div class="sn-radio-group">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Model} from "vue-property-decorator";

    @Component({
        name: "SnRadioGroup"
    })
    export default class SnRadioGroup extends Vue {
        /** 绑定值 */
        @Model('change')
        public model: string | number | boolean;

        /** 是否禁用 */
        @Prop(Boolean)
        public disabled: boolean;

        /** 修改值 */
        public changeModel(val: string | number | boolean) {
            this.$emit('change', val)
        }
    }
</script>
