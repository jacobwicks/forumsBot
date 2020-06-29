import {
    DisplayAction,
    ActionsAction,
    ActionsActionTypes,
} from '../../../../../types/types';
import { regExpPrefix, reviver } from '../../../../JSONParseRegExReviver';
import setValue from '../../SetValue';
import { getTriggerConfigKeys } from '..';

const setTriggerValue = async ({
    dispatch,
    actions,
    action,
    index,
    value,
}: {
    dispatch: React.Dispatch<ActionsAction>;
    actions: { [key: string]: DisplayAction };
    action: string;
    index: number;
    value: string;
}) => {
    const oldValue = actions[action];

    //store it in the API as a string with the regExpPrefix Added
    const regExpValue = `${regExpPrefix}${value}`;

    let triggers = [...oldValue.triggers];

    const isRegExp = triggers[index] instanceof RegExp;

    try {
        const validRegex: boolean = reviver('', regExpValue, true);

        if (isRegExp && !validRegex) return;

        triggers.splice(index, 1, isRegExp ? reviver('', regExpValue) : value);

        const newValue = { ...oldValue, triggers };

        dispatch({
            type: ActionsActionTypes.setAction,
            key: action,
            value: newValue,
        });

        const configKeys = getTriggerConfigKeys({ action, index });

        const result = await setValue({
            configKeys,
            value: isRegExp ? regExpValue : value,
        });

        if (!result)
            dispatch({
                type: ActionsActionTypes.setAction,
                key: action,
                value: oldValue,
            });
    } catch (err) {
        console.log('there was an error setting trigger');
    }
};

export default setTriggerValue;
