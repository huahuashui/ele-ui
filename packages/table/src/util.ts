// copy from element-ui util
export function getValueByPath(object: any, prop: string) {
    prop = prop || '';
    const paths = prop.split('.');
    let current = object;
    let result = null;
    for (let i = 0, j = paths.length; i < j; i++) {
        const path = paths[i];
        if (!current) break;

        if (i === j - 1) {
            result = current[path];
            break;
        }
        current = current[path];
    }
    return result;
}

export function renderByProp({row, prop}: { row: Object, prop: string }) {
    return row && getValueByPath(row, prop);
}
