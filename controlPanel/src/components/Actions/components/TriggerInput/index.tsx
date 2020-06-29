import React, { useContext, useState, useEffect } from 'react';
import { ActionsContext } from '../../../../services/ActionsContext';
import { Loader, Popup, Icon, Input, Label, Button } from 'semantic-ui-react';
import { Trigger } from '../../../../types/types';
import { spacing } from '../../../../services/Spacing';
import {
    deleteTrigger,
    convertTrigger,
    setTriggerValue,
} from '../../../../services/Api';

const TriggerInput = ({
    index,
    trigger,
}: {
    index: number;
    trigger: Trigger;
}) => {
    const isRegExp = trigger instanceof RegExp;

    const { dispatch, action, actions } = useContext(ActionsContext);
    const [open, setOpen] = useState(false);
    const [changing, setChanging] = useState(false);
    const [temp, setTemp] = useState(trigger.toString());
    const triggersLength = action && actions[action].triggers.length;

    useEffect(() => {
        setOpen(false);
    }, [triggersLength, setOpen]);

    if (!action) return <Loader active />;

    //sets the value of the trigger
    const handleBlur = (value: string) => {
        !changing &&
            setTriggerValue({
                dispatch,
                actions,
                action,
                index,
                value,
            });
    };

    const changeTrigger = async () => {
        setChanging(true);

        await convertTrigger({
            dispatch,
            actions,
            action,
            index,
            trigger,
        });

        setChanging(false);
    };

    return (
        <div style={spacing}>
            <Button icon onClick={() => setOpen(!open)}>
                <Icon name="edit" />
            </Button>
            <Label
                size="large"
                content={index}
                color={isRegExp ? 'blue' : undefined}
            />{' '}
            {!open ? (
                trigger.toString()
            ) : (
                <>
                    <Input
                        onBlur={(e: InputEvent) => {
                            const target = e.target as HTMLInputElement;
                            handleBlur(target.value);
                        }}
                        onKeyPress={({ key }: { key: string }) => {
                            if (key === 'Enter') handleBlur(temp);
                        }}
                        onChange={({ target }) => setTemp(target.value)}
                        value={temp}
                    />
                    <Popup
                        content={`Delete trigger ${index} from ${action}`}
                        trigger={
                            <Icon
                                name="trash"
                                onClick={() =>
                                    deleteTrigger({
                                        dispatch,
                                        actions,
                                        action,
                                        index,
                                    })
                                }
                                size="large"
                                style={{ cursor: 'pointer' }}
                            />
                        }
                    />
                    <Popup
                        content={
                            isRegExp
                                ? `Change to string`
                                : `Change to RegExp. Must enclose expression in forward slash characters '/' '/' and add desired flags`
                        }
                        trigger={
                            <Icon
                                name={isRegExp ? 'text height' : 'r circle'}
                                onClick={() => changeTrigger()}
                                size="large"
                                style={{ cursor: 'pointer' }}
                            />
                        }
                    />
                </>
            )}
        </div>
    );
};

export default TriggerInput;
