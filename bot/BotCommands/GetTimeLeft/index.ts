import { getInterval } from '../../../services/Config';

export const getTimeLeft = async () => {
    const { expose } = require('../../index');
    const { timeIntervalStarted } = expose;

    const interval = await getInterval();

    if (!interval) return undefined;

    if (!timeIntervalStarted) return undefined;

    const intervalMilliseconds = interval * 60 * 1000;
    const currentTime = new Date().getTime();

    const timeLeft = intervalMilliseconds - (currentTime - timeIntervalStarted);
    return timeLeft;
};

export default getTimeLeft;
