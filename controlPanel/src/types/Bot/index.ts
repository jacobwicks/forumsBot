import { Apis } from '../types';

//the types of action that the reducer in BotContext will handle
export enum BotActionTypes {
    decreaseInterval = 'decreaseInterval',
    increaseInterval = 'increaseInterval',
    fetchAttempt = 'fetchAttempt',
    fetchFailure = 'fetchFailure',
    fetchSuccess = 'fetchSuccess',
    runOnce = 'runOnce',
    setBotName = 'setBotName',
    setCookies = 'setCookies',
    setInterval = 'setInterval',
    setRunning = 'setRunning',
    setTimer = 'setTimer',
    setValueAttempt = 'setValueAttempt',
    setValueFailure = 'setValueFailure',
    setValueSuccess = 'setValueSuccess',
    start = 'start',
    stop = 'stop',
    testCookies = 'testCookies',
}

export enum BotFetchKeys {
    APIs = 'APIs',
    settings = 'settings',
}
export type BotAction =
    //decreases the run interval
    | { type: BotActionTypes.decreaseInterval }

    //increases the run interval
    | { type: BotActionTypes.increaseInterval }

    //attempting to fetch something from the api
    | { type: BotActionTypes.fetchAttempt; key: BotFetchKeys }

    //fetching failed
    | { type: BotActionTypes.fetchFailure; key: BotFetchKeys }

    //load APIs received from API into context
    | {
          type: BotActionTypes.fetchSuccess;
          key: BotFetchKeys;
          content: Apis | FrontEndBotSettings;
      }

    //runs the bot once with current settings, then stops the bot
    | { type: BotActionTypes.runOnce }

    //sets the bot name
    | { type: BotActionTypes.setBotName; botName: string }

    //sets the Forum Cookies
    | { type: BotActionTypes.setCookies; cookies: Cookies }

    //sets if the bot is currently running or not
    | { type: BotActionTypes.setRunning; running: boolean }

    //sets the timer
    | { type: BotActionTypes.setTimer; timer: Timer }

    //starts the bot running at current intervals
    | { type: BotActionTypes.start }

    //stops the bot from running if it is already running
    | { type: BotActionTypes.stop }

    //sets the interval in minutes at which the bot runs
    | { type: BotActionTypes.setInterval; interval: number }

    //sets cookies.testing to true
    | { type: BotActionTypes.testCookies };

//The Dispatch function
interface BotDispatch {
    dispatch: (action: BotAction) => void;
}

export interface Cookies {
    exist?: boolean;
    refreshing: boolean;
    testing: boolean;
    work?: boolean;
}

export interface FrontEndBotSettings {
    //the name that posters use to get the bot's attention
    botName: string;

    cookies: Cookies;

    //how often the bot runs in minutes, must be > 1
    interval: number;

    //If the bot is set to run every interval or not
    on: boolean;

    //if the bot is currently running or not
    running: boolean;
}

export interface Timer {
    minutes: number;
    seconds: number;
}

interface BotType {
    api: string;
    APIs?: Apis;
    fetching: string[];
    hasFailed: string[];
    settings?: FrontEndBotSettings;
    timer: Timer;
}

//a union type. The LoggedIn state will have a Stats object for any given key
//except dispatch will return the LoggedInDispatch function
export type BotState = BotType & BotDispatch;
