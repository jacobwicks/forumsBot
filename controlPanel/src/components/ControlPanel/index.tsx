import React, { useContext, useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
import Actions from '../Actions';
import Albums from '../Albums';
import APIs from '../APIs';
import Credentials from '../Credentials';
import Settings from '../Settings';
import Threads from '../Threads';
import { listenToEvents } from '../../services/Api';
import { EventsContext } from '../../services/EventsContext';
import { BotContext } from '../../services/BotContext';
import { ThreadsContext } from '../../services/ThreadsContext';

// edit the config.json file that the bot accesses
// input api keys and secrets to config.json file
// Change the bot name
// change the sa userName and password stored in the bot config
// turn responses (keyword and action pairs) on and off
// view logs, including date picker
// view stats
// review images submitted to albums, accept or reject them
// ignore users
// set email addres for error alerts/crashes
// real time viewer- scrolling window of executed instructions, posts made, and errors
// Start and STop button
// Interval timer
// Countdouwn until next time the bot runs
// List of current threads viewed

const tabs = [
    {
        menuItem: 'Controls',
        render: () => (
            <Tab.Pane>
                <Settings />
            </Tab.Pane>
        ),
    },
    {
        menuItem: 'Threads',
        render: () => (
            <Tab.Pane>
                <Threads />
            </Tab.Pane>
        ),
    },
    {
        menuItem: 'Credentials',
        render: () => (
            <Tab.Pane>
                <Credentials />
            </Tab.Pane>
        ),
    },
    {
        menuItem: 'Actions',
        render: () => (
            <Tab.Pane>
                <Actions />
            </Tab.Pane>
        ),
    },
    {
        menuItem: 'Image Albums',
        render: () => (
            <Tab.Pane>
                <Albums />
            </Tab.Pane>
        ),
    },
    {
        menuItem: 'APIs',
        render: () => (
            <Tab.Pane>
                <APIs />
            </Tab.Pane>
        ),
    },
];

const ControlPanel = () => {
    const { dispatch: eventsDispatch, failed, listening } = useContext(
        EventsContext
    );
    const { dispatch: threadsDispatch } = useContext(ThreadsContext);
    const { dispatch: botDispatch } = useContext(BotContext);

    useEffect(() => {
        !listening &&
            !failed &&
            listenToEvents({
                botDispatch,
                eventsDispatch,
                threadsDispatch,
            });
    }, [listening, failed, botDispatch, eventsDispatch, threadsDispatch]);

    return <Tab panes={tabs} />;
};

export default ControlPanel;
