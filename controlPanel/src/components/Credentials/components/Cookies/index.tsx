import React, { useContext } from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { BotContext } from '../../../../services/BotContext';
import { Cookies as ICookies } from '../../../../types/Bot';
import {
    testCookies,
    refreshCookies,
    clearCookies,
} from '../../../../services/Api';

const dummy: ICookies = {
    exist: undefined,
    refreshing: false,
    testing: false,
    work: undefined,
};

const Cookies = () => {
    const { dispatch, settings } = useContext(BotContext);
    const cookies = settings?.cookies;
    const { exist, refreshing, testing, work } = cookies || dummy;

    return (
        <Segment>
            Cookies: {exist ? 'Stored cookies found' : 'No stored cookies'}
            <br />
            <br />
            <Button
                loading={testing}
                onClick={() => !testing && !refreshing && testCookies(dispatch)}
            >
                Test Cookies
            </Button>{' '}
            {!testing && work !== undefined && (
                <Icon
                    name={work ? 'thumbs up outline' : 'thumbs down outline'}
                />
            )}
            <br />
            <br />
            <Button
                onClick={() =>
                    !testing && !refreshing && refreshCookies(dispatch)
                }
                loading={refreshing}
            >
                Get New Cookies
            </Button>
            <br />
            <br />
            <Button onClick={() => exist && clearCookies(dispatch)}>
                Clear Cookies
            </Button>
        </Segment>
    );
};

export default Cookies;
