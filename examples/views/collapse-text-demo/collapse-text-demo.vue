<template>
    <div class="m-copy-text">
        <div class="m-copy-text-header">
            <sn-collapse-text :value="valueDemo" :title="titleDemo"></sn-collapse-text>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import SnCollapseText from "../../../packages/collapse-text"

    @Component({
        components: {
            SnCollapseText
        }
    })
    export default class CopyTextDemo extends Vue {
        private titleDemo: string = "this is title"
        private valueDemo: string = "this is value,this is value,this is value,this is value,this is value,this is value,this is value,this is value,"

        public created() {
        };

        public mounted() {

        };
    }
</script>

<style scoped lang="scss">
    .m-copy-text {
        width: 100%;
        height: 500px;
        margin: 0 auto;
        position: relative;
        
        &-header {
            width: 250px;
            height: 50px;
            margin: 50px auto 0;
            position: absolute;
            top: 20%;
            left: 0;
        }
    }
</style>
