export const regExpPrefix = '__REGEXP ';

export const reviver = (key: string, value: any, test?: boolean) => {
    if (value.toString().indexOf(regExpPrefix) === 0) {
        try {
            var m = value.split(regExpPrefix)[1].match(/\/(.*)\/(.*)?/);
            const regExp = new RegExp(m[1], m[2] || '');
            return test ? true : regExp;
        } catch (err) {
            return test ? false : 'failedRegex';
        }
    } else return value;
};
