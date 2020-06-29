import React, { useContext, useState } from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { BotContext } from '../../../../services/BotContext';
import { runOnceForThread } from '../../../../services/Api';
import RotatingCog from '../../../RotatingCog';
import LogViewer from '../../../LogViewer';

const RunOnceForThreadButton = ({ threadId }: { threadId: number }) => {
    const [open, setOpen] = useState(false);
    const { dispatch, settings } = useContext(BotContext);
    const running = !!settings?.running;
    return (
        <>
            <Button
                color="blue"
                onClick={() => {
                    setOpen(true);
                    !running &&
                        runOnceForThread({
                            dispatch,
                            threadId,
                        });
                }}
            >
                {running ? (
                    <RotatingCog size="large" />
                ) : (
                    <Icon name="play circle" size="large" />
                )}
                {running ? 'Running' : 'Run Once For This Thread'}
            </Button>
            {open && (
                <Segment>
                    <Button
                        floated="right"
                        icon="close"
                        onClick={() => setOpen(false)}
                    />
                    <LogViewer lines={6} />
                </Segment>
            )}
        </>
    );
};

export default RunOnceForThreadButton;
