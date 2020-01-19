<template>
    <div class="sn-upload">
        <input type="file"
               ref="input"
               class="sn-upload__input"
               :accept="accept"
               :multiple="multiple"
               @change="handleUploadChange">
        <div class="sn-upload__trigger" v-if="!$slots.trigger" @click="handleClick">
            <slot></slot>
        </div>
        <div class="sn-upload__trigger" v-if="$slots.trigger" @click="handleClick">
            <slot name="trigger"></slot>
        </div>
        <template v-if="$slots.trigger">
            <slot></slot>
        </template>
        <div class="sn-upload__tip">
            <slot name="tip"></slot>
        </div>
        
        <!-- 预览图 -->
        <sn-upload-list :file-list="fileModuleList"
                        :list-type="listType"
                        @delete="handleDeleteFile">
            <div slot="upload" @click="handleClick">+</div>
        </sn-upload-list>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import SnUploadList from "./upload-list.vue";

    import {uploadAjax, UploadAjaxOptions} from "./ajax";
    import {FileEx, FileModule} from "../../../types/upload";
    
    @Component({
        name: 'SnUpload',
        components: {
            SnUploadList
        }
    })
    export default class SnUpload extends Vue {
        /** 文件列表的类型 */
        @Prop({type: String, default: 'text'})
        public listType: 'text' | 'picture' | 'picture-card';


        /** 上传的文件字段名 */
        @Prop({type: String, default: 'file'})
        public filename: string;

        /** 文件上传方式 */
        @Prop({type: String, default: 'post'})
        public method: string;

        /** 必选参数，上传的地址 */
        @Prop({type: String, required: true})
        public action: string;

        /** 设置上传的请求头部 */
        @Prop({type: Object, default: () => ({})})
        public headers: Record<string, string>;

        /** 接受上传的文件类型（thumbnail-mode 模式下此参数无效） */
        @Prop(String)
        public accept: string;

        /** 上传时附带的额外参数 */
        @Prop(Object)
        public formData: Record<string, any>;

        /** multiple为 true, 最大允许上传个数 */
        @Prop(Number)
        public limit: number;

        /** 是否在选取文件后立即进行上传 */
        @Prop({type: Boolean, default: true})
        public autoUpload: boolean;

        /** 支持发送 cookie 凭证信息 */
        @Prop(Boolean)
        public withCredentials: boolean;

        /** 是否支持多选文件 */
        @Prop(Boolean)
        public multiple: boolean;

        /**
         * 上传文件之前的钩子，参数为上传的文件，
         * 若返回 false 或者返回 Promise 且被 reject，则停止上传。
         */
        @Prop()
        public beforeUpload: (rawFile: FileEx[]) => boolean;

        /** 开始上传 */
        @Prop()
        public startUpload: (fileModule: FileModule) => void;

        /** 上传进度 */
        @Prop()
        public uploadProgress: (event: any, fileModule: any) => void;

        /** 上传成功  */
        @Prop()
        public uploadSuccess: (res: any, fileModule: any) => void;

        /** 上传失败 */
        @Prop()
        public uploadError: (error: any, fileModule: any) => void;

        // 标识
        private tempIndex: number = 1;
        // 上传请求集合
        private requestMap: Record<string, any> = {};

        // 上传文件集合
        private fileModuleList: FileModule[] = [];

        // 手动上传文件列表
        public submit() {
            if (this.fileModuleList.length <= 0) {return}
            this.fileModuleList
                .filter(fileModule => fileModule.status === 'ready')
                .forEach(fileModule => {
                    // 调用接口
                    this.httpRequest(fileModule.raw);
                })
        }

        // 点击上传
        protected handleClick() {
            this.inputRef().value = null;
            this.inputRef().click();
        }

        // 上传文件改变
        protected handleUploadChange(e: any) {
            const rawFiles = e.target.files;
            // 获取文件集合
            this.handleUploadFiles(rawFiles);
        };

        // 移除照片墙-某项
        protected handleDeleteFile(data: FileModule, index: number) {
            this.fileModuleList.splice(index, 1);
        }

        private beforeDestroy() {
            this.fileModuleList.forEach(fileModule => {
                if (fileModule.url && fileModule.url.indexOf('blob:') === 0) {
                    URL.revokeObjectURL(fileModule.url);
                }
            });
        }

        // ref
        private inputRef() {
            return this.$refs.input as HTMLInputElement;
        }

        // 上传文件
        private handleUploadFiles(rawFiles: FileEx[]) {
            if (!rawFiles || rawFiles.length <= 0) {return;}
            let postFiles = Array.prototype.slice.call(rawFiles);
            if (!this.multiple) {
                postFiles = postFiles.slice(0, 1);
            } else {
                // 上传文件数量超出限制-不加入队列
                if (this.limit && postFiles.length > this.limit) {
                    postFiles = postFiles.slice(0, this.limit);
                }
            }

            // 上传前钩子
            let isContinue = true;
            if (typeof this.beforeUpload === 'function') {
                isContinue = this.beforeUpload(rawFiles);
            }
            if (!isContinue) {return}

            // 执行上传
            postFiles.forEach((rawFile: FileEx) => {
                this.handleUploadStart(rawFile);
                if (this.autoUpload) {
                    this.httpRequest(rawFile);
                }
            });
        }

        // ajax请求
        private httpRequest(rawFile: FileEx) {
            this.inputRef().value = null;
            const options = {
                filename: this.filename,
                action: this.action,
                method: this.method,
                headers: this.headers,
                formData: this.formData,
                file: rawFile,
                withCredentials: this.withCredentials,
                onProgress: (event: any) => {
                    this.handleUploadProgress(event, rawFile);
                },
                onSuccess: (res: any) => {
                    this.handleUploadSuccess(res, rawFile);
                    delete this.requestMap[rawFile.uid];
                },
                onError: (err: any) => {
                    this.handleUploadError(err, rawFile);
                    delete this.requestMap[rawFile.uid];
                }
            } as UploadAjaxOptions;

            // 缓存ajax对象
            this.requestMap[rawFile.uid] = uploadAjax(options);
        }

        // 开始上传
        private handleUploadStart(rawFile: FileEx) {
            rawFile.uid = Date.now() + '__' + this.tempIndex++;

            let imageUrl = null;

            if (this.listType === 'picture-card' || this.listType === 'picture') {
                try {
                    imageUrl = URL.createObjectURL(rawFile);
                } catch (err) {
                    console.error('[Upload Error]', err);
                    return;
                }
            }

            const fileModule = {
                status: 'ready',
                name: rawFile.name,
                size: rawFile.size,
                percentage: 0,
                uid: rawFile.uid,
                raw: rawFile,
                url: imageUrl
            } as FileModule;

            this.fileModuleList.push(fileModule);

            if (typeof this.startUpload === 'function') {
                this.startUpload(fileModule);
            }
        }

        // 上传进度
        private handleUploadProgress(event: any, rawFile: FileEx) {
            const fileModule = this.getFileModule(rawFile);
            fileModule.status = 'uploading';
            fileModule.percentage = event.percent || 0;

            if (typeof this.uploadProgress === 'function') {
                this.uploadProgress(event, fileModule);
            }
        }

        // 上传成功
        private handleUploadSuccess(res: any, rawFile: FileEx) {
            const fileModule = this.getFileModule(rawFile);
            fileModule.status = 'success';
            fileModule.response = res;

            if (typeof this.uploadSuccess === 'function') {
                this.uploadSuccess(res, fileModule);
            }
        }

        // 上传失败
        private handleUploadError(err: any, rawFile: FileEx) {
            const fileModule = this.removeFileModule(rawFile);
            fileModule.status = 'error';

            if (typeof this.uploadError === 'function') {
                this.uploadError(err, rawFile);
            }
        }

        // 终止上传
        private abortUpload(file: FileEx) {
            const {requestMap} = this;
            if (file) {
                const uid = file ? file.uid : '';
                if (requestMap[uid]) {
                    requestMap[uid].abort();
                    delete requestMap[uid];
                }
            } else {
                Object.keys(requestMap).forEach(uid => {
                    if (requestMap[uid]) {
                        requestMap[uid].abort();
                        delete requestMap[uid];
                    }
                });
            }
        }

        // 获取对应自定义文件信息
        private getFileModule(rawFile: FileEx): FileModule {
            return this.fileModuleList.find(item => item.uid === rawFile.uid);
        }

        // 移除对应自定义文件信息
        private removeFileModule(rawFile: FileEx): FileModule {
            const index = this.fileModuleList.findIndex(item => item.uid === rawFile.uid);
            return this.fileModuleList.splice(index, 1)[0];
        }
    }
</script>
