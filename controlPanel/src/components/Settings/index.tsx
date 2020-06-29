import React, { useContext, useEffect } from 'react';
import { Segment } from 'semantic-ui-react';
import { BotContext } from '../../services/BotContext';
import { BotFetchKeys } from '../../types/types';
import { loadSettings } from '../../services/Api';
import BotStateDisplay from './components/BotStateDisplay';
import ControlButtons from './components/ControlButtons';
import Interval from './components/Interval';
import LogViewer from '../LogViewer/';

const Settings = () => {
    const { dispatch, hasFailed, fetching, settings } = useContext(BotContext);

    useEffect(() => {
        if (
            !fetching.includes(BotFetchKeys.settings) &&
            !hasFailed.includes(BotFetchKeys.settings) &&
            !settings
        ) {
            //the settings and timer also come in as server sent events
            //but server sent events are slow to start up, fetch is quick
            loadSettings(dispatch);
        }
    }, [dispatch, fetching, hasFailed, settings]);

    return (
        <div>
            <Segment>
                <LogViewer />
            </Segment>
            <Segment>
                <ControlButtons />
                <BotStateDisplay />
                <Interval />
            </Segment>
        </div>
    );
};

export default Settings;
