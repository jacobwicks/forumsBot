import { getConfig, writeToConfig } from '../index';

const apiConfigKeys = ['apis'];

export const getApiKeys = async (): Promise<string[] | false> => {
    const apis = await getApis();
    return apis && Object.keys(apis);
};

const getApis = async (): Promise<{ [key: string]: any } | false> => {
    const config = await getConfig();
    return config?.apis;
};

export const getApi = async (requestedApi: string) => {
    const apis = await getApis();
    return apis ? apis[requestedApi] : undefined;
};

export const setApiValue = async ({
    api,
    key,
    value,
}: {
    api: string;
    key: string | string[];
    value: string;
}) => {
    const configKeys = Array.isArray(key)
        ? [...apiConfigKeys, api].concat(key)
        : [...apiConfigKeys, api, key];

    return await writeToConfig({
        configKeys,
        value,
    });
};
