import authFetch from '../AuthFetch';
import { BotAction, BotActionTypes } from '../../../../types/Bot';

const runOnce = async (dispatch: React.Dispatch<BotAction>) => {
    dispatch({ type: BotActionTypes.setRunning, running: true });
    const route = 'runOnce';
    const running = (await authFetch(route))?.status === 200;

    !running && dispatch({ type: BotActionTypes.setRunning, running: false });
};

const runOnceForThread = async ({
    dispatch,
    threadId,
}: {
    dispatch: React.Dispatch<BotAction>;
    threadId: number;
}) => {
    dispatch({ type: BotActionTypes.setRunning, running: true });
    const route = 'runOnceForThread';

    const running =
        (await authFetch(route, true, { threadId }))?.status === 200;

    !running && dispatch({ type: BotActionTypes.setRunning, running: false });
};

const startBot = async (dispatch: React.Dispatch<BotAction>) => {
    dispatch({ type: BotActionTypes.start });
    const route = 'startBot';
    const started = (await authFetch(route))?.status === 200;

    !started && dispatch({ type: BotActionTypes.stop });
};

const stopBot = async ({
    dispatch,
    on,
    running,
}: {
    dispatch: React.Dispatch<BotAction>;
    on: boolean;
    running: boolean;
}) => {
    dispatch({ type: BotActionTypes.stop });
    const route = 'stopBot';
    const stopped = (await authFetch(route))?.status;

    if (stopped) {
        dispatch({ type: BotActionTypes.setRunning, running: false });
    } else {
        on && dispatch({ type: BotActionTypes.start });
        running && dispatch({ type: BotActionTypes.setRunning, running: true });
    }
};

export { startBot, stopBot, runOnce, runOnceForThread };
