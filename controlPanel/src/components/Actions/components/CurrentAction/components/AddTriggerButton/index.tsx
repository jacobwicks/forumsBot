import React, { useContext } from 'react';
import setValue from '../../../../../../services/Api/services/SetValue';
import { ActionsContext } from '../../../../../../services/ActionsContext';
import { ActionsActionTypes } from '../../../../../../types/types';
import { Button, Popup } from 'semantic-ui-react';

const AddTriggerButton = () => {
    const { dispatch, action, actions } = useContext(ActionsContext);
    if (!action) return <></>;

    const triggersKeys = ['actions', action, 'triggers'];

    const addTrigger = async () => {
        const oldValue = actions[action];
        const triggers = [...oldValue.triggers];
        triggers.push('');

        const newValue = { ...oldValue, triggers };

        dispatch({
            type: ActionsActionTypes.setAction,
            key: action,
            value: newValue,
        });

        const result = await setValue({
            configKeys: triggersKeys,
            value: triggers,
        });

        if (!result)
            dispatch({
                type: ActionsActionTypes.setAction,
                key: action,
                value: oldValue,
            });
    };
    return (
        <Popup
            content={`Add trigger to ${action}`}
            trigger={<Button icon="add" onClick={() => addTrigger()} />}
        />
    );
};

export default AddTriggerButton;
