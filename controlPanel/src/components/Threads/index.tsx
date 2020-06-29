import React, { useContext, useEffect } from 'react';
import { ThreadsContext } from '../../services/ThreadsContext';
import { loadThreads } from '../../services/Api/services/Threads';
import {
    Grid,
    Header,
    Loader,
    Message,
    Segment,
    Button,
} from 'semantic-ui-react';
import CurrentThread from './components/CurrentThread';
import SideBarThreads from './components/SideBarThreads';
import { BotContext } from '../../services/BotContext';
import usePrevious from '../../services/UsePrevious';

const Threads = () => {
    const { dispatch, failed, fetching, threads } = useContext(ThreadsContext);
    const { settings } = useContext(BotContext);
    const running = !!settings?.running;
    const wasRunning = usePrevious(running);

    useEffect(() => {
        !fetching && !failed && !threads && loadThreads(dispatch);
    }, [dispatch, fetching, failed, threads]);

    useEffect(() => {
        !fetching && !failed && !running && wasRunning && loadThreads(dispatch);
    }, [dispatch, fetching, failed, running, wasRunning]);

    if (!threads && fetching) return <Loader active />;

    if (!threads && failed)
        return <Message warning>Failed to load threads</Message>;

    return (
        <Segment>
            <Grid columns={2} divided>
                <Grid.Column width={4}>
                    <Header as="h2">
                        Threads{' '}
                        <Button
                            disabled={fetching}
                            onClick={() => loadThreads(dispatch)}
                            floated="right"
                            icon="refresh"
                        />
                    </Header>
                    <SideBarThreads />
                </Grid.Column>
                <Grid.Column width={12}>
                    <CurrentThread />
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default Threads;
