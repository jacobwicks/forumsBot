//stringify RegExp returns {}
//so we need a replacer function to stringify it
export const replacer = (key: string, value: any) => {
    if (value instanceof RegExp) return '__REGEXP ' + value.toString();
    else return value;
};

export const reviver = (key: string, value: any) => {
    if (value?.toString().indexOf('__REGEXP ') === 0) {
        try {
            var m = value.split('__REGEXP ')[1].match(/\/(.*)\/(.*)?/);
            return new RegExp(m[1], m[2] || '');
        } catch (err) {
            return value;
        }
    } else return value;
};
