import {FileEx} from "../../../types/upload";

interface UploadAjaxOptions {
    // 上传的文件字段名
    filename: string;

    // 文件上传方式
    method: string;

    // 上传的地址
    action: string;

    // 请求头
    headers: Record<string, any>;

    // 上传时附带的额外参数
    formData: Record<string, any>;

    // 上传文件信息
    file: FileEx;

    // 支持发送 cookie 凭证信息
    withCredentials: boolean;

    // 上传进度
    onProgress(event: any): void;

    // 上传失败
    onError(event: any): void;

    // 上传成功
    onSuccess(event: any): void;
}

function getError(method: string, action: string, xhr: XMLHttpRequest) {
    let msg;
    if (xhr.response) {
        msg = `${xhr.response.error || xhr.response}`;
    } else if (xhr.responseText) {
        msg = `${xhr.responseText}`;
    } else {
        msg = `fail to post ${action} ${xhr.status}`;
    }
    const err: any = new Error(msg);
    err.status = xhr.status;
    err.method = method;
    err.url = action;
    return err;
}

function getBody(xhr: XMLHttpRequest) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

function uploadAjax(option: UploadAjaxOptions) {
    if (typeof XMLHttpRequest === 'undefined') {return;}
    const xhr = new XMLHttpRequest();
    if (xhr.upload) {
        xhr.upload.onprogress = function progress(e: any) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }
            option.onProgress(e);
        };
    }
    const formData = new FormData();
    if (option.formData) {
        Object.keys(option.formData).forEach(key => {
            formData.append(key, option.formData[key]);
        });
    }
    formData.append(option.filename, option.file, option.file.name);
    xhr.onerror = function error(e: any) {
        option.onError(e);
    };
    xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(option.method, option.action, xhr));
        }
        option.onSuccess(getBody(xhr));
    };
    xhr.open(option.method, option.action, true);
    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }
    const headers = option.headers || {};
    for (const key in headers) {
        if (headers.hasOwnProperty(key) && headers[key] !== null) {
            xhr.setRequestHeader(key, headers[key]);
        }
    }
    xhr.send(formData);
    return xhr;
}

export {
    UploadAjaxOptions,
    uploadAjax
}
