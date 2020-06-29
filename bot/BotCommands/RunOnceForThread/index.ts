import { sendLogEvent } from '../../../services/Events';
import runBot from '../RunBot';
import { setRunning } from '../../../services/Config';
import { bot } from '../..';

export const runOnceForThread = async (threadId: number) => {
    sendLogEvent(`Bot running once for thread ${threadId}...`);

    setRunning(true);
    sendLogEvent({ setting: { running: true } });

    await bot(threadId);

    setRunning(false);

    sendLogEvent({ setting: { running: false } });
};

export default runOnceForThread;
