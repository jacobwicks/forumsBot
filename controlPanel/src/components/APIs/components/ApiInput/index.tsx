import React, { useContext } from 'react';
import { ApiActionTypes } from '../../../../types/Apis';
import { ApiContext } from '../../../../services/ApiContext';
import EditableInput from '../../../EditableInput';
import setValue from '../../../../services/Api/services/SetValue';

const ApiInput = ({
    api,
    input,
    keys,
    value,
}: {
    //the name of the api
    api: string;

    //the name of the target property
    input?: string;

    //apis can contain objects
    //if so, these keys locate the property for editing
    keys?: string[];

    //the value
    value: string | boolean;
}) => {
    const { dispatch, apis } = useContext(ApiContext);
    let configKeys = keys ? keys : ['apis', api];

    //add the named input to the configKeys string[]
    //if no input value, then the api key just holds a string
    input && (configKeys = [...configKeys, input]);

    const oldValue = apis[api];

    const callback = async (value: string) => {
        if (typeof oldValue === 'string') {
            dispatch({
                type: ApiActionTypes.setApi,
                api,
                value,
            });
        } else {
            //if (!input) throw new Error('cannot set api value without target');
            let newValue = { ...oldValue };
            let target = newValue as any;

            configKeys.slice(2).forEach((key, index) => {
                if (index + 3 === configKeys.length) {
                    if (Array.isArray(target) || target.hasOwnProperty(key)) {
                        //set the last key equal to the supplied value
                        target[key] = value;
                    } else target = undefined as any;
                } else target = target[key];
            });

            dispatch({
                type: ApiActionTypes.setApi,
                api,
                value: newValue,
            });
        }

        const result = await setValue({
            configKeys,
            value,
        });

        if (!result)
            dispatch({
                type: ApiActionTypes.setApi,
                api,
                value: oldValue,
            });
    };

    return (
        <EditableInput
            configKeys={configKeys}
            callback={callback}
            input={input ? input : api}
            labelText={input ? undefined : `${api} Key`}
            value={value}
        />
    );
};

export default ApiInput;
