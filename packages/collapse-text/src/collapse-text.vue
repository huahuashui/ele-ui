<template>
    <div :title="show ? value : title"
         @click="toggle"
         class="sn-collapse-text"
         :class="{'collapse-open': show, 'collapse-close': !show}">
        {{value}}
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component({
        name: 'SnCollapseText'
    })
    export default class SnCollapseText extends Vue {
        @Prop({default: null})
        public value: string;

        @Prop({default: null})
        public title: string;

        protected show: boolean = false;

        protected toggle($event: any) {
            $event.stopPropagation();
            this.show = !this.show;
        }
    }
</script>
