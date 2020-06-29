import React, { useContext } from 'react';
import { BotContext } from '../../../../services/BotContext';
import { Icon, Message, Label, Grid } from 'semantic-ui-react';
import Timer from '../Timer';
import RotatingCog from '../../../RotatingCog';

const BotStateDisplay = () => {
    const { settings } = useContext(BotContext);
    const on = !!settings?.on;
    const running = !!settings?.running;

    return (
        <Message>
            <Grid columns="2">
                <Grid.Column width="5">
                    <Message.Header>Bot State</Message.Header>
                    <Label
                        color={running ? 'blue' : on ? 'green' : 'red'}
                        size="huge"
                    >
                        <div>
                            {running ? (
                                <RotatingCog size="huge" />
                            ) : (
                                <Icon size="huge" name={on ? 'play' : 'stop'} />
                            )}
                        </div>
                        {running ? 'On' : on ? 'Idle' : 'Off'}
                    </Label>
                </Grid.Column>
                <Grid.Column width="5">
                    <Message.Header>
                        <Icon name="clock" size="big" />
                        Next Bot Run
                    </Message.Header>
                    <Timer />
                </Grid.Column>
            </Grid>
        </Message>
    );
};

export default BotStateDisplay;
