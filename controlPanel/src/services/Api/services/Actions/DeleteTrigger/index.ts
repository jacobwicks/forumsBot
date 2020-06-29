import { ActionsActionTypes, ActionsAction } from '../../../../../types/types';
import setValue from '../../SetValue';
import { getTriggerConfigKeys } from '..';

const deleteTrigger = async ({
    dispatch,
    actions,
    action,
    index,
}: {
    dispatch: React.Dispatch<ActionsAction>;
    actions: any;
    action: string;
    index: number;
}) => {
    const oldValue = actions[action];
    let triggers = [...oldValue.triggers];
    triggers.splice(index, 1);

    const newValue = { ...oldValue, triggers };

    dispatch({
        type: ActionsActionTypes.setAction,
        key: action,
        value: newValue,
    });

    const configKeys = getTriggerConfigKeys({ action, index });

    const result = await setValue({
        configKeys: configKeys,
        value: triggers,
    });

    if (!result)
        dispatch({
            type: ActionsActionTypes.setAction,
            key: action,
            value: oldValue,
        });
};

export default deleteTrigger;
