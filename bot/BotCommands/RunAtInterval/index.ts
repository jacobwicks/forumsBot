import { getInterval } from '../../../services/Config';
import { sendLogEvent } from '../../../services/Events';
import getTimeLeft from '../GetTimeLeft';
import runBot from '../RunBot';

//run the bot every interval
export const runAtInterval = async () => {
    const { expose } = require('../../index');

    //clear the current interval, or else
    //you get stacked intervals. fun times
    expose.botOn && clearTimeout(expose.botOn);

    //run the bot every so many minutes
    const intervalMinutes = await getInterval();

    if (intervalMinutes) {
        //multiply minute value by 1000 to get seconds, by 60 to get minutes
        const intervalMilliseconds = intervalMinutes * 60 * 1000;

        sendLogEvent(`Bot will run every ${intervalMinutes} minutes`);
        expose.botOn = setTimeout(() => runBot(true), intervalMilliseconds);

        //store the time this interval started
        expose.timeIntervalStarted = new Date().getTime();

        //send an event to the control panel
        const timeLeft = await getTimeLeft();
        sendLogEvent({ timeLeft });
    } else {
        sendLogEvent({
            error: 'No valid interval returned. Bot not running',
            invalidInterval: intervalMinutes,
        });

        console.log('No valid interval returned', intervalMinutes);
    }
};

export default runAtInterval;
