<template>
    <ul class="sn-upload-list"
        :class="{
            'sn-upload-list--picture-card': isPictureCard ,
            'sn-upload-list--picture': isPicture,
        }">
        <li class="list-item" v-for="(file,index) in fileList" :key="file.uid">
            <slot :file="file">
                <div class="list-item_img" v-if="isPictureCard || isPicture">
                    <img v-if="file.url"
                         :style="imgStyle"
                         :src="file.url"
                         @load.stop="handleLoad"
                         alt="not found"/>
                </div>
                <span class="list-item_name" v-if="!isPictureCard">
                    <i class="list-item_file sn-icon-file" v-if="!isPicture"></i>{{file.name}}
                </span>
                <div class="list-item_status" v-if="file.status === 'success'"></div>
                <div class="list-item_actions">
                    <span class="list-item_delete" @click="$emit('delete', file, index)">×</span>
                </div>
                <div class="list-item_progress" v-if="file.status === 'uploading'">
                    <sn-progress stroke-width="100%"
                                 :stroke-height="isPictureCard ? '6px' : '2px'"
                                 :type="isPictureCard ? 'circle' : 'line'"
                                 :percent="file.percentage">
                    </sn-progress>
                </div>
            </slot>
        </li>
        <!--卡片上传-->
        <li class="list-item is-card" v-if="isPictureCard">
            <slot name="upload"></slot>
        </li>
    </ul>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import SnProgress from "ele-ui/packages/progress/index";
    import {FileModule} from "../../../types/upload";

    @Component({
        name: 'SnUploadList',
        components: {
            SnProgress
        }
    })
    export default class SnUploadList extends Vue {
        // 上传文件集合
        @Prop()
        public fileList: FileModule[];

        /** 文件列表的类型 */
        @Prop(String)
        public listType: 'text' | 'picture' | 'picture-card';

        // 图片居中样式
        protected imgStyle: any = null;

        get isPictureCard() {
            return this.listType === 'picture-card';
        }

        get isPicture() {
            return this.listType === 'picture';
        }

        // 图片加载完毕后
        // todo 上传不同图片，后一次上传图片，会影响上一次图片的居中，暂不清楚原因
        protected handleLoad(e: any) {
            const img = e.target as HTMLImageElement;
            // 图片实际宽度
            const img_w = e.target.naturalWidth;
            // 图片实际高度
            const img_h = e.target.naturalHeight;
            // 容器宽度
            const box_w: number = img.parentElement.offsetWidth;
            // 容器高度
            const box_h: number = img.parentElement.offsetHeight;
            // 容器与图片的宽比例
            const scale_w = box_w / img_w;
            // 容器与图片的高比例
            const scale_h = box_h / img_h;

            if (scale_w >= scale_h) {
                // 宽度缩放比例大于高度缩放比例，
                // 所以当放大同等比例时，高度缩放到容器大小时，宽度不会超出
                this.imgStyle = {
                    width: 'auto',
                    height: '100%',
                };
            } else {
                // 宽度缩放比例小于高度缩放比例，
                // 所以当放大同等比例时，宽度缩放到容器大小时，高度不会超出
                this.imgStyle = {
                    width: '100%',
                    height: 'auto',
                };
            }
        }
    }
</script>
