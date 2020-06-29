import { setOn, getOn } from '../../../services/Config';
import { sendLogEvent } from '../../../services/Events';

export const stopBot = async () => {
    const { expose } = require('../../index');
    try {
        await setOn(false);
    } catch (err) {
        sendLogEvent({
            error: "Couldn't stop bot",
        });
        return false;
    }
    // //if the bot is currently running
    // //close the browser it is using
    // expose.exposedBrowser && expose.exposedBrowser.close();

    //clear the interval, if one is going
    if (expose.botOn) {
        clearTimeout(expose.botOn);
        expose.botOn = undefined;
    }

    //clear stored interval start time
    //used to calculate time until next execution
    expose.timeIntervalStarted = 0;

    sendLogEvent('Stopped bot');
    sendLogEvent({ setting: { on: await getOn() } });

    throw new Error('stop the bot');
};

export default stopBot;
