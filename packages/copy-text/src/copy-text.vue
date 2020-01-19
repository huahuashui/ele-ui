<template>
    <div class="sn-copy-text">
        <input type="text" class="ipt" v-model="contentText" readonly>
    </div>
</template>
<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";

    @Component({
        name: 'SnCopyText'
    })
    export default class SnCopyText extends Vue {
        @Prop({default: '', type: [Number, String]})
        protected copyContent!: string | number;

        private contentText = this.copyContent;

        @Watch('copyContent')
        private watchCopyContent(newVal: string | number) {
            this.contentText = newVal;
        }
    }
</script>
