import React, { useContext } from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { ActionsActionTypes } from '../../../../types/types';
import { ActionsContext } from '../../../../services/ActionsContext';
import EditableInput from '../../../EditableInput';
import Instructions from '../Instructions';
import TriggerInstruction from '../TriggerInstruction';
import Triggers from './components/Triggers';

const actionsConfigKeys = ['actions'];

const NoAction = () => (
    <Segment>
        <Header>No Action Selected</Header>
    </Segment>
);

const CurrentAction = () => {
    const { dispatch, action, actions } = useContext(ActionsContext);

    const currentAction = action && actions[action];
    if (!currentAction) return <NoAction />;

    const { active, triggers } = currentAction;

    const configKeys = [...actionsConfigKeys, action as string];

    return (
        <>
            <Instructions
                action={action as string}
                addChildren={[<TriggerInstruction triggers={triggers} />]}
            />
            <EditableInput
                checkbox={true}
                configKeys={configKeys}
                dispatch={dispatch}
                dispatchBefore={[
                    {
                        type: ActionsActionTypes.setActive,
                        key: action as string,
                    } as any,
                ]}
                dispatchOnFailure={[
                    {
                        type: ActionsActionTypes.setActive,
                        key: action as string,
                        value: active,
                    } as any,
                ]}
                input={'active'}
                value={active}
            />
            <Triggers action={action as string} triggers={triggers} />
        </>
    );
};

export default CurrentAction;
