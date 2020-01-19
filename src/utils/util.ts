/**
 * 多个对象的属性合并到目标对象上
 * @param target
 * @param opts
 * @return {Object}
 */
export function objectAssign(target: any, ...opts: any[]) {
    for (let i = 1, j = arguments.length; i < j; i++) {
        const source = arguments[i] || {} as { [key: string]: any };
        for (const prop in source) {
            if (source.hasOwnProperty(prop)) {
                const value = source[prop];
                if (value !== undefined) {
                    target[prop] = value;
                }
            }
        }
    }
    return target;
}

/**
 * 通过路径字段，获取在目标对象中的值
 * @param obj 目标对象
 * @param path 路径字段
 * @param strict
 * @return {{o: any, k: (string|any), v: null}}
 */
export function getPropByPath(obj: any, path: string, strict?: boolean) {
    let tempObj = obj;
    path = path.replace(/:/g, '.');
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    const keyArr = path.split('.');
    let i = 0;
    for (const len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj && !strict) break;
        const key = keyArr[i];
        if (key in tempObj) {
            tempObj = tempObj[key];
        } else {
            if (strict) {
                throw new Error('please transfer a valid prop path to form item!');
            }
            break;
        }
    }
    return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj ? tempObj[keyArr[i]] : null
    };
}

/**
 * 将驼峰式命名的字符串转换为下划线大写方式。如果转换前的驼峰式命名的字符串为空，则返回空字符串。</br>
 * 例如：HelloWorld->HELLO-WORLD
 * @param str 转换前的驼峰式命名的字符串
 * @param linkStr
 * @return 转换后下划线大写方式命名的字符串
 */
    // Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = function (str: string) { return str.replace(hyphenateRE, '-$1').toLowerCase(); };

/**
 * 空函数
 */
export function noop() {}

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
export function debounce(func: () => void, wait: number, context: any = null, immediate: boolean = true) {
    let timer: any, args: any

    // 延迟执行函数
    const later = () => setTimeout(() => {
        // 延迟函数执行完毕，清空缓存的定时器序号
        timer = null
        // 延迟执行的情况下，函数会在延迟函数中执行
        // 使用到之前缓存的参数和上下文
        if (!immediate) {
            func.apply(context, args)
            context = args = null
        }
    }, wait)

    // 这里返回的函数是每次实际调用的函数
    return function (...params: any[]) {
        // 如果没有创建延迟执行函数（later），就创建一个
        if (!timer) {
            timer = later()
            // 如果是立即执行，调用函数
            // 否则缓存参数和调用上下文
            if (immediate) {
                func.apply(context, params)
            } else {
                args = params
            }
            // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
            // 这样做延迟函数会重新计时
        } else {
            clearTimeout(timer)
            timer = later()
        }
    }
}

/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数
 */
export function throttle(func: (val: any) => any, wait: number, context: any = null, options?: { leading: boolean, trailing: boolean }) {
    let args: any, result: any;
    let timeout: any = null;
    // 之前的时间戳
    let previous: number = 0;
    // 如果 options 没传则设为空对象
    if (!options) options = {} as { leading: boolean, trailing: boolean };
    return function () {
        // 获得当前时间戳
        const now: number = +new Date();
        // 首次进入前者肯定为 true
        // 如果需要第一次不执行函数
        // 就将上次时间戳设为当前的
        // 这样在接下来计算 remaining 的值时会大于0
        if (!previous && options.leading === false) previous = now;
        // 计算剩余时间
        const remaining: number = wait - (now - previous);
        args = arguments;
        // 如果当前调用已经大于上次调用时间 + wait
        // 或者用户手动调了时间
        // 如果设置了 trailing，只会进入这个条件
        // 如果没有设置 leading，那么第一次会进入这个条件
        // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
        // 其实还是会进入的，因为定时器的延时
        // 并不是准确的时间，很可能你设置了2秒
        // 但是他需要2.2秒才触发，这时候就会进入这个条件
        if (remaining <= 0 || remaining > wait) {
            // 如果存在定时器就清理掉否则会调用二次回调
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            // 判断是否设置了定时器和 trailing
            // 没有的话就开启一个定时器
            // 并且不能不能同时设置 leading 和 trailing
            timeout = setTimeout(function () {
                // 如果设置了 leading，就将 previous 设为 0
                // 用于下面函数的第一个 if 判断
                previous = options.leading === false ? 0 : +new Date();
                // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }, remaining);
        }
        return result;
    };
};


/**
 * 字符串截取
 * @param origin 原始字符串
 * @param key 截取所参照的字符串信息
 * @param opts:
 *      subMode boolean true正序截取, false倒序截取 默认为true
 *      isSaveKey boolean 是否在截取的字符串中保留key 默认为true
 *      useFirst boolean 是否使用最先匹配到key的index作为基准截取(true), 否则则取最后一个匹配到的(false) 默认为true
 */
export function stringInterception(origin: string, key: string, opts?: { subMode?: boolean, isSaveKey?: boolean, useFirst?: boolean }) {
    if (origin == null || key == null) return origin;
    opts = opts || {};
    // tslint:disable-next-line:prefer-const
    let subMode = opts.subMode != null ? opts.subMode : true,
        // tslint:disable-next-line:prefer-const
        isSaveKey = opts.isSaveKey != null ? opts.isSaveKey : true,
        // tslint:disable-next-line:prefer-const
        useFirst = opts.useFirst != null ? opts.useFirst : true,
        result = null,
        // tslint:disable-next-line:prefer-const
        keyLen = key.length,
        index = -1,
        indexOfFunc = useFirst ? origin.indexOf : origin.lastIndexOf;
    index = indexOfFunc.call(origin, key);
    if (index >= 0) { // 匹配到了
        if (subMode) { // 根据subMode和isSaveKey返回合适的字符串
            result = isSaveKey ? origin.substring(index) : origin.substring(index + keyLen);
        } else {
            result = isSaveKey ? origin.substring(0, index + keyLen) : origin.substring(0, index);
        }
    }
    indexOfFunc = null;

    return result;
}

/**
 * 转换string为number
 * @param origin
 * @return 若string转换后为isNaN, 则直接返回origin
 */
export function convertString2Num(origin: string | number, defaultNumber?: number) {
    if (typeof origin === "number") {
        // 若本身是number类型, 则不转
        return origin;
    } else if (typeof origin === "string") {
        // strin类型, 转换为number类型
        const result = Number(origin);
        if (isNaN(result)) {
            return defaultNumber != null ? defaultNumber : origin;
        } else {
            return result;
        }
    } else {
        // 其他情况
        return defaultNumber != null ? defaultNumber : origin;
    }
}

/**
 * 检查是否arguments为函数
 * @param
 * @return 判断是否为一个function,返回布尔值
 */
export const isFunction = (val: any) => typeof val === 'function';

/**
 * 生成UUID(实为随机数，暂定)
 * @param
 * @return 生成一个随机数，重复概率小(并不是为零)
 */
export function getUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // tslint:disable-next-line:prefer-const
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 判断字符串是否是空字符
 * @param str
 * @returns {boolean}
 * @example
 * '' => true
 * '  ' => true
 * {} => false
 * null => true
 * undefined => true
 * 0 => false
 * '0' => true
 */
export function isEmptyString(str?: string): boolean {
    // 判断null 和 undefined
    if (str == null) {
        return true;
    }
    // 判断是否为字符串
    if (typeof str !== 'string') {
        return false;
    }
    // 判断是否为""
    if (str.trim() === "") {
        return true;
    }
    return false;
}
