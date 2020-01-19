<template>
    <div class="m-copy-text">
        <div class="m-copy-text-header">
            <sn-copy-text :copyContent="titleWord"></sn-copy-text>
            <div class="m-copy-text-header-desc">
                这里是复制文本框
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";
import SnCopyText from "../../../packages/copy-text/index"
@Component({
    components: {
        SnCopyText
    }
})
export default class CopyTextDemo extends Vue {
    private titleWord: string = "this words only can be copied"

    public created() {

    };

    public mounted() {

    };
}
</script>

<style scoped lang="scss">
.m-copy-text {
    width: 45%;
    height: 500px;
    border: 1px solid red;
    margin: 0 auto;
    &-header {
        width: 60%;
        height: 50px;
        margin: 50px auto 0;
        &-desc {
            margin-top: 20px;
        }
    }
}
</style>
