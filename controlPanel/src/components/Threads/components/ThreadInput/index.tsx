import React, { useContext } from 'react';
import { ThreadsActionTypes } from '../../../../types/types';
import { ThreadsContext } from '../../../../services/ThreadsContext';
import EditableInput from '../../../EditableInput';

const ThreadInput = ({
    threadId,
    callback,
    checkbox,
    input,
    labelText,
    textArea,
    type,
    value,
}: {
    threadId: number;

    callback?: (args: any) => void;

    //render a checkbox
    checkbox?: boolean;

    //the type of action to set the input value
    type?: ThreadsActionTypes;

    //the input
    input: string;

    labelText?: string;

    //render a textarea
    textArea?: boolean;

    //the old value of the input
    value?: string | boolean;
}) => {
    const { dispatch } = useContext(ThreadsContext);

    const configKeys = ['threads', threadId.toString()];

    return (
        <EditableInput
            callback={callback}
            checkbox={checkbox}
            configKeys={configKeys}
            dispatch={dispatch}
            dispatchBefore={type && [{ type, thread: threadId } as any]}
            dispatchOnFailure={
                type && [
                    {
                        type,
                        thread: threadId,
                        value,
                    } as any,
                ]
            }
            input={input}
            labelText={labelText}
            textArea={textArea}
            value={value}
        />
    );
};

export default ThreadInput;
