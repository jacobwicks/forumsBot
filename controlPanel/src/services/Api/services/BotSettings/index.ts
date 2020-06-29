import authFetch, { authFetchJSON } from '../AuthFetch';
import {
    BotFetchKeys,
    FrontEndBotSettings,
    BotActionTypes,
    BotAction,
} from '../../../../types/types';

interface BotSettingsResponse {
    settings: FrontEndBotSettings;
}

type BSR = BotSettingsResponse | undefined;

//gets the current settings for the bot
const getSettings = async () => {
    const route = 'settings';
    const settings = ((await authFetchJSON(route)) as BSR)?.settings;
    return settings;
};

// const decreaseInterval = async () => {};
// const increaseInterval = async () => {};
function debounce(f: (...args: any) => any, waitFor: number = 400) {
    let timer: any = null;

    return (...args: any) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
            timer = setTimeout(() => resolve(f(...args)), waitFor);
        });
    };
}

export const setBotInterval = debounce(async (interval: number) => {
    const body = { interval };
    const route = 'setBotInterval';
    const response = await authFetch(route, true, body);
    return response?.status === 200;
}, 400);

// export const setBotInterval = debounce(async (interval: number) => {
//     const body = { interval };
//     const route = 'setInterval';
//     const response = await authFetch(route, true, body);
//     return 'whaaa';
//     //return response?.status === 200;
// });

export const clearCookies = async (dispatch: React.Dispatch<BotAction>) => {
    dispatch({
        type: BotActionTypes.setCookies,
        cookies: {
            exist: true,
            refreshing: false,
            work: undefined,
            testing: false,
        },
    });

    const route = 'clearCookies';
    const cleared = (await authFetch(route))?.status === 200;

    const cookies = {
        exist: !cleared,
        refreshing: false,
        work: undefined,
        testing: false,
    };

    dispatch({ type: BotActionTypes.setCookies, cookies });
};

export const refreshCookies = async (dispatch: React.Dispatch<BotAction>) => {
    dispatch({
        type: BotActionTypes.setCookies,
        cookies: {
            exist: false,
            refreshing: true,
            work: undefined,
            testing: false,
        },
    });

    const route = 'refreshCookies';
    const result = (await authFetch(route))?.status === 200;

    const cookies = {
        exist: result,
        refreshing: false,
        work: result ? true : undefined,
        testing: false,
    };

    dispatch({ type: BotActionTypes.setCookies, cookies });
};

export const testCookies = async (dispatch: React.Dispatch<BotAction>) => {
    dispatch({ type: BotActionTypes.testCookies });
    const route = 'testCookies';
    const result = (await authFetch(route))?.status === 200;

    const cookies = {
        exist: true,
        refreshing: false,
        work: !!result,
        testing: false,
    };

    dispatch({ type: BotActionTypes.setCookies, cookies });
};

export const loadSettings = async (dispatch: React.Dispatch<BotAction>) => {
    dispatch({ type: BotActionTypes.fetchAttempt, key: BotFetchKeys.settings });
    const settings = await getSettings();
    if (settings) {
        settings.cookies = {
            ...settings.cookies,
            refreshing: false,
            testing: false,
            work: undefined,
        };

        dispatch({
            type: BotActionTypes.fetchSuccess,
            key: BotFetchKeys.settings,
            content: settings,
        });
    } else
        dispatch({
            type: BotActionTypes.fetchFailure,
            key: BotFetchKeys.settings,
        });
};

export default loadSettings;
