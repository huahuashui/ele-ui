import {SnUIComponent} from "./component";

/** 文件对象 */
export interface FileEx extends File {
    // 文件标识
    uid: string;
}

/** 自定义文件对象 */
export interface FileModule {
    /** 文件标识 */
    uid: string;

    /** 上传状态 */
    status: 'ready' | 'uploading' | 'success' | 'error';

    /** 文件名 */
    name: string;

    /** 文件大小 */
    size: number;

    /** 上传进度 */
    percentage: number;

    /** 原始文件信息对象 */
    raw: FileEx;

    /** 返回结果 */
    response: any;

    /** 图片地址 */
    url: string;
}

/** 文件列表的类型 */
export type ListType = 'text' | 'picture' | 'picture-card';

/** Upload Component */
export declare interface SnUpload extends SnUIComponent {
    /** 文件列表的类型 */
    listType: ListType;

    /** 上传的文件字段名 */
    filename: string;

    /** 文件上传方式 */
    method: string;

    /** 必选参数，上传的地址 */
    action: string;

    /** 设置上传的请求头部 */
    headers: Record<string, string>;

    /** 接受上传的文件类型（thumbnail-mode 模式下此参数无效） */
    accept: string;

    /** 上传时附带的额外参数 */
    formData: Record<string, any>;

    /** multiple为 true, 最大允许上传个数 */
    limit: number;

    /** 是否在选取文件后立即进行上传 */
    autoUpload: boolean;

    /** 支持发送 cookie 凭证信息 */
    withCredentials: boolean;

    /** 是否支持多选文件 */
    multiple: boolean;

    /**
     * 上传文件之前的钩子，参数为上传的文件，
     * 若返回 false 或者返回 Promise 且被 reject，则停止上传。
     */
    beforeUpload: (rawFile: FileEx[]) => boolean;

    /** 开始上传 */
    startUpload: (fileModule: FileModule) => void;

    /** 上传进度 */
    uploadProgress: (event: any, fileModule: any) => void;

    /** 上传成功  */
    uploadSuccess: (res: any, fileModule: any) => void;

    /** 上传失败 */
    uploadError: (error: any, fileModule: any) => void;

    /** 主动触发上传 */
    submit(): void;
}
