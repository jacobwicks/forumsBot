import { runAtInterval } from '../..';
import { sendLogEvent } from '../../../services/Events';
import { getInterval } from '../../../services/Config';

export const resetInterval = async () => {
    const { expose } = require('../../index');

    if (expose.botOn) {
        clearTimeout(expose.botOn);
        expose.botOn = undefined;

        expose.timeIntervalStarted = 0;
        runAtInterval();
    } else {
        const interval = await getInterval();
        sendLogEvent(
            `Interval changed to ${interval}. When bot is turned on, it will run every ${interval} minutes.`
        );
    }
};

export default resetInterval;
