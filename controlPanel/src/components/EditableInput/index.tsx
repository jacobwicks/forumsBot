import React, { useState, useEffect } from 'react';
import { Button, Icon, Label, SemanticCOLORS } from 'semantic-ui-react';
import {
    ActionsAction,
    AlbumsAction,
    BotAction,
    ThreadsAction,
} from '../../types/types';
import setValue from '../../services/Api/services/SetValue';
import setProperty from '../../services/Api/services/SetProperty';
import dispatchAll from './services/DispatchAll';
import CheckboxChild from './components/CheckboxChild';
import InputChild from './components/InputChild';
import TextAreaChild from './components/TextAreaChild';

export type ActionArray = [
    ActionsAction | AlbumsAction | BotAction | ThreadsAction
];

//lots of props, but it's a very capable input component
interface EditableInputProps {
    //function called instead of dispatchBefore
    //lets you use editableInput for something besides dispatching actions
    callback?: (...args: any) => void;

    //display a checkbox
    checkbox?: boolean;

    //the path of the variable that the input edits
    //the API uses this to find the setting that is being edited
    configKeys: string[];

    //dispatch to the appropriate config
    dispatch?: (action: any) => void;

    //dispatch actions before calling setValue
    dispatchBefore?: ActionArray;

    //dispatch actions if setValue fails
    dispatchOnFailure?: ActionArray;

    //dispatch actions is setValue succeeds
    dispatchOnSuccess?: ActionArray;

    //the name of the input
    //this is used as the key in the key: value pair
    //when editing the config file in the API/Bot
    input: string;

    labelColor?: SemanticCOLORS;

    //human readable label text if the input name isn't good
    labelText?: string;

    //password mask the input
    password?: boolean;

    renameValueTo?: string;
    //target is an object property, not a value
    //e.g. the album name is used as a key for the value of the album
    //it is an object property of albums
    targetsProperty?: boolean;

    //the parent comppnent wants to know the EditableInput is open for editing
    tellParentOpen?: (open: boolean) => void;

    //show a textarea when open instead of an input
    //right now, will automatically choose textarea if value is longer than 19 char
    textArea?: boolean;

    //the starting value
    value?: string | boolean;
}

const EditableInput = ({
    configKeys,
    callback,
    checkbox,
    dispatch,
    dispatchBefore,
    dispatchOnFailure,
    dispatchOnSuccess,
    input,
    labelColor,
    labelText,
    password,
    renameValueTo,
    targetsProperty,
    tellParentOpen,
    textArea,
    value,
}: EditableInputProps) => {
    const [open, setOpen] = useState(false);
    const [temp, setTemp] = useState(value);

    //if the parent component wants to know if the input is open
    useEffect(() => {
        tellParentOpen && tellParentOpen(open);
    }, [open, tellParentOpen]);

    const handleBlur = async (value: string | boolean | number | undefined) => {
        setOpen(false);

        if (callback) {
            callback(value);
        } else if (dispatch) {
            //if requested, dispatch the attempt to context
            dispatchAll({
                dispatch,
                actions: dispatchBefore?.map((action) =>
                    renameValueTo
                        ? {
                              ...action,
                              [renameValueTo]: value,
                          }
                        : {
                              ...action,
                              //add the current value to the action
                              value,
                          }
                ) as any,
            });

            //call api to attempt changeValue
            const result = targetsProperty
                ? await setProperty({
                      configKeys: [...configKeys, input],
                      value,
                  })
                : await setValue({
                      configKeys: [...configKeys, input],
                      value,
                  });

            result
                ? //if value was set, dispatch success actions
                  dispatchAll({ dispatch, actions: dispatchOnSuccess })
                : //else dispatch failure actions
                  //normally, to reset value to prior value
                  //because change failed
                  dispatchAll({ dispatch, actions: dispatchOnFailure });
        } else {
            //call api to attempt changeValue
            targetsProperty
                ? await setProperty({
                      configKeys: [...configKeys, input],
                      value,
                  })
                : await setValue({
                      configKeys: [...configKeys, input],
                      value,
                  });
        }
    };

    const checkboxChild = (
        <CheckboxChild
            data-testid="status"
            handleBlur={handleBlur}
            value={value}
        />
    );

    const inputChild = (
        <InputChild
            handleBlur={handleBlur}
            temp={temp}
            setTemp={setTemp}
            password={!!password}
        />
    );

    const textareaChild = (
        <TextAreaChild handleBlur={handleBlur} temp={temp} setTemp={setTemp} />
    );

    // prettier-ignore
    const child = checkbox
        ? checkboxChild
        : textArea || (typeof(value) === 'string' && value.length > 19)
            ? textareaChild
            : inputChild;

    return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
            <Button
                icon
                onClick={() =>
                    checkbox ? handleBlur(!!!value) : setOpen(!open)
                }
            >
                <Icon name="edit" />
            </Button>
            <Label
                size="large"
                content={`${labelText ? labelText : input}`}
                color={labelColor}
            />{' '}
            {
                // prettier-ignore
                checkbox 
                ? child 
                : open 
                    ? child 
                    : password 
                        ? <span style={{fontSize:'x-large'}}>•••••</span> 
                        :value
            }
        </div>
    );
};

export default EditableInput;
