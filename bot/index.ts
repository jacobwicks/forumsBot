import log from './services/log';
import { setRunning } from '../services/Config';
import { sendLogEvent } from '../services/Events';
import {
    getTimeLeft,
    resetInterval,
    runAtInterval,
    runOnce,
    runOnceForThread,
    startBot,
    stopBot,
} from './BotCommands';
import login from './services/FromSA/LogIn';
import getBookmarkedThreadsAndRunInstructions from './services/FromSA/GetBookmarkedThreadsAndRunInstructions';
import getBookmarkedThreads, {
    getAnnotatedThreads,
} from './services/FromSA/GetBookmarkedThreads';
import markLastRead from './services/FromSA/MarkLastRead';
import getThreadAndRunInstructions from './services/FromSA/GetThreadAndRunInstructions';
import { updateActionsInConfig, getDisplayActions } from './services/actions';

interface BotExpose {
    botOn: NodeJS.Timeout | undefined;
    exposedBrowser: undefined;
    timeIntervalStarted: number;
}

//expose variables that the bot uses to other functions
const expose: BotExpose = {
    //this will hold a reference to the bot interval timer
    //lets us start and reset the timer
    botOn: undefined,

    //this will hold a reference to the puppeteer browser
    //lets us stop the bot from running
    exposedBrowser: undefined,

    //when the current interval started counting down
    timeIntervalStarted: 0,
};

export const bot = async (threadId?: number) => {
    try {
        //login loads the stored cookies
        //checks if they work,
        //and gets new cookies if necessary
        await login();

        sendLogEvent('bot has logged in');

        //gets the bookmarked threads, gets posts
        //finds instructions and runs them
        threadId
            ? await getThreadAndRunInstructions(threadId)
            : await getBookmarkedThreadsAndRunInstructions();

        sendLogEvent('bot finished, logging out');
    } catch (err) {
        log(err);
        setRunning(false);
        sendLogEvent({ setting: { running: false } });
    }
};

export {
    expose,
    getAnnotatedThreads,
    getBookmarkedThreads,
    getDisplayActions,
    getTimeLeft,
    login,
    markLastRead,
    resetInterval,
    runAtInterval,
    runOnce,
    runOnceForThread,
    startBot,
    stopBot,
    updateActionsInConfig,
};
