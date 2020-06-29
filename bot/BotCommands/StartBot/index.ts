import { setOn, getOn } from '../../../services/Config';
import { sendLogEvent } from '../../../services/Events';
import { runAtInterval } from '../..';

//starts the bot
export const startBot = async () => {
    try {
        //sets on to true in the config
        await setOn(true);
    } catch (err) {
        sendLogEvent({
            error: "Couldn't start bot",
        });
        return false;
    }

    runAtInterval();
    sendLogEvent({ setting: { on: await getOn() } });
    return true;
};

export default startBot;
