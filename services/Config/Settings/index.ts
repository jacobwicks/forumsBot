import { getConfig, writeToConfig } from '../index';
//import { resetInterval } from '../../../bot/saBot';
const resetInterval = () => undefined;

const settingsConfigKeys = ['settings'];

export const getSettings = async () => {
    const config = await getConfig();
    return config?.settings;
};

export const getBotName = async () => {
    const settings = await getSettings();
    return settings?.botName;
};

export const getCreds = async () => {
    const settings = await getSettings();
    return settings?.creds;
};

export const getCredsUsername = async () => {
    const creds = await getCreds();
    return creds?.username;
};

export const getCredsPassword = async () => {
    const creds = await getCreds();
    return creds?.password;
};

export const getInterval = async () => {
    const settings = await getSettings();
    return settings?.interval;
};

export const getOn = async () => {
    const settings = await getSettings();
    return settings?.on;
};

export const setBotInterval = async (interval: number) => {
    if (typeof interval !== 'number' || interval < 2) {
        return false;
    } else {
        //also reach into bot and change it
        const configKeys = [...settingsConfigKeys, 'interval'];
        const intervalSet = await writeToConfig({
            configKeys,
            value: interval,
        });
        await resetInterval();
        return intervalSet;
    }
};
export const setOn = async (on: boolean) => {
    const configKeys = [...settingsConfigKeys, 'on'];
    return await writeToConfig({ configKeys, value: on });
};

export const getRunning = async () => {
    const settings = await getSettings();
    return settings?.running;
};

export const setRunning = async (running: boolean) => {
    const configKeys = [...settingsConfigKeys, 'running'];
    return await writeToConfig({ configKeys, value: running });
};
