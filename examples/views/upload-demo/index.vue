<template>
    <div class="m-upload-demo">
        <sn-upload ref="snUpload"
                   filename="filename"
                   method="post"
                   action="https://jsonplaceholder.typicode.com/posts/"
                   :headers="{
                        'AuthCacheKey': '11111'
                   }"
                   accept="image/png"
                   :formData="{
                        a: 1
                   }"
                   :limit="1"
                   :auto-upload="false"
                   :multiple="true"
                   :list-type="listType"
                   :start-upload="handleStart"
                   :upload-progress="handleProgress"
                   :upload-success="handleSuccess"
                   :upload-error="handleError">
            
            <sn-button slot="trigger">选取文件</sn-button>
            <span slot="tip">只能上传jpg/png文件，且不超过500kb</span>
            <sn-button @click="handleSubmit">上传到服务器</sn-button>
            <sn-button @click="listType='text'">text</sn-button>
            <sn-button @click="listType='picture'">picture</sn-button>
            <sn-button @click="listType='picture-card'">picture-card</sn-button>
        
        </sn-upload>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component({
        name: 'UploadDemo',
        components: {}
    })
    export default class UploadDemo extends Vue {
        protected listType: string = 'text';

        protected handleExceed(rawFiles: any) {
            console.error('上传验证', rawFiles);
        }

        protected handleStart(rawFile: any, rawFiles: any) {
            console.error('上传开始', rawFile, rawFiles);
        }

        protected handleProgress(rawFile: any, rawFiles: any) {
            console.error('上传进度', rawFile, rawFiles);
        }

        protected handleSuccess(rawFile: any, rawFiles: any) {
            console.error('上传成功', rawFile, rawFiles);
        }

        protected handleError(rawFile: any, rawFiles: any) {
            console.error('上传失败', rawFile, rawFiles);
        }

        protected handleSubmit() {
            this.snUploadRef().submit();
        }

        private snUploadRef() {
            return this.$refs.snUpload as any;
        }
    }
</script>

<style lang="scss">
    .m-upload-demo {
        margin: 20px;
    }
</style>
