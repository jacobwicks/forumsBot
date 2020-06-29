import React, { useContext } from 'react';
import { BotContext } from '../../../../services/BotContext';
import { Loader, Segment } from 'semantic-ui-react';
import EditableInput from '../../../EditableInput';
import { settingsConfigKeys } from '../..';
import { BotActionTypes, BotAction } from '../../../../types/Bot';

const BotName = () => {
    const { dispatch, settings } = useContext(BotContext);
    const botName = settings?.botName;

    if (!botName) return <Loader active />;

    return (
        <Segment>
            <EditableInput
                dispatch={dispatch}
                dispatchBefore={[
                    { type: BotActionTypes.setBotName } as BotAction,
                ]}
                dispatchOnFailure={[
                    { type: BotActionTypes.setBotName, botName },
                ]}
                configKeys={settingsConfigKeys}
                input={'botName'}
                renameValueTo={'botName'}
                value={botName}
            />
        </Segment>
    );
};

export default BotName;
