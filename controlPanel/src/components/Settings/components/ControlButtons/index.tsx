import React, { useContext } from 'react';
import { BotContext } from '../../../../services/BotContext';
import { Button, Icon } from 'semantic-ui-react';
import { startBot, stopBot, runOnce } from '../../../../services/Api';

const ControlButtons = () => {
    const { dispatch, settings } = useContext(BotContext);
    const on = !!settings?.on;
    const running = !!settings?.running;

    return (
        <div>
            <Button onClick={() => !on && startBot(dispatch)} color="green">
                <Icon name="play" size="large" />
                Start
            </Button>
            <Button
                onClick={() =>
                    (on || running) &&
                    stopBot({
                        dispatch,
                        on,
                        running,
                    })
                }
                color="red"
            >
                <Icon name="stop" size="large" />
                Stop
            </Button>
            <Button color="blue" onClick={() => !running && runOnce(dispatch)}>
                <Icon name="play circle" size="large" />
                Run Once
            </Button>
        </div>
    );
};

export default ControlButtons;
