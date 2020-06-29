import { getConfig, writeToConfig } from '../index';
import { KeyString } from '../../../types';
import { convertObjectToString } from '../../../bot/services/FromSA/GetCookiesFromResponse';

export const getCookies = async () => {
    const config = await getConfig();
    return config?.cookies;
};

export const getCookieString = async () => {
    const cookies = await getCookies();
    return cookies ? convertObjectToString(cookies) : undefined;
};

export const setCookies = async (newCookies: KeyString) => {
    const configKeys = ['cookies'];
    return await writeToConfig({ configKeys, value: newCookies });
};

export const clearCookies = async () => {
    return await setCookies({});
};
