import {
    Trigger,
    ActionsAction,
    ActionsActionTypes,
} from '../../../../../types/types';
import { regExpPrefix, reviver } from '../../../../JSONParseRegExReviver';
import setValue from '../../SetValue';
import { getTriggerConfigKeys } from '..';

const convertTrigger = async ({
    dispatch,
    actions,
    action,
    index,
    trigger,
}: {
    dispatch: React.Dispatch<ActionsAction>;
    actions: any;
    action: string;
    index: number;
    trigger: Trigger;
}) => {
    // //blocks the callback from firing
    // setChanging(true);
    const oldValue = actions[action];

    //store it in the API as a string with the regExpPrefix Added
    const regExpValue = `${regExpPrefix}${trigger}`;

    const isRegExp = trigger instanceof RegExp;

    try {
        const validRegExp = reviver('', regExpValue, true);
        if (!isRegExp && !validRegExp) return;

        let triggers = [...oldValue.triggers];
        triggers.splice(
            index,
            1,
            //if it's a RegExp already, store a string
            isRegExp
                ? trigger.toString()
                : //if it's a string, store a RegExp
                  reviver('', regExpValue)
        );

        console.log('triggers are now', triggers);

        const newValue = { ...oldValue, triggers };

        dispatch({
            type: ActionsActionTypes.setAction,
            key: action,
            value: newValue,
        });

        const configKeys = getTriggerConfigKeys({ action, index });

        //store it in the API
        const result = await setValue({
            configKeys,
            value: isRegExp ? trigger.toString() : regExpValue,
        });

        if (!result)
            dispatch({
                type: ActionsActionTypes.setAction,
                key: action,
                value: oldValue,
            });

        return result;
    } catch (err) {
        console.error(err);
        return false;
    }
};

export default convertTrigger;
