import { sendLogEvent } from '../../../services/Events';
import runBot from '../RunBot';

export const runOnce = () => {
    sendLogEvent('Bot running once...');
    runBot();
    return true;
};

export default runOnce;
