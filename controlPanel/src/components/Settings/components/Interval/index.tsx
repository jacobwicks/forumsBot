import React, { useContext, useState } from 'react';
import { Button, Input, Message } from 'semantic-ui-react';
import { BotContext } from '../../../../services/BotContext';
import { BotActionTypes } from '../../../../types/types';
import { setBotInterval } from '../../../../services/Api';

const Interval = () => {
    const { dispatch, settings } = useContext(BotContext);
    const interval = settings?.interval;
    const [priorValue, setPriorValue] = useState<number | undefined>(undefined);

    const trySetInterval = async (newInterval: number, resetValue: number) => {
        const didSet = await setBotInterval(newInterval);

        if (didSet) {
            setPriorValue(undefined);
        } else {
            resetValue &&
                dispatch({
                    type: BotActionTypes.setInterval,
                    interval: resetValue,
                });
            setPriorValue(undefined);
        }
    };
    return (
        <React.Fragment>
            <Message>
                <Message.Header>Interval</Message.Header>
                <p>Runs Every {interval} Minutes</p>
            </Message>
            <div>
                <Button
                    onClick={() => {
                        if (interval) {
                            if (!priorValue) {
                                setPriorValue(interval);
                            }
                            //increases interval in context
                            dispatch({ type: BotActionTypes.increaseInterval });
                            trySetInterval(
                                interval + 1,
                                priorValue ? priorValue : interval
                            );
                        }
                    }}
                >
                    Increase
                </Button>
                <Button
                    onClick={() => {
                        if (interval && interval > 2) {
                            if (!priorValue) {
                                setPriorValue(interval);
                            }
                            //increases interval in context
                            dispatch({ type: BotActionTypes.decreaseInterval });
                            trySetInterval(
                                interval - 1,
                                priorValue ? priorValue : interval
                            );
                        }
                    }}
                >
                    Decrease
                </Button>
                <Input
                    onKeyDown={async ({
                        key,
                        target,
                    }: {
                        key: string;
                        target: HTMLInputElement;
                    }) => {
                        if (key === 'Enter') {
                            const { value } = target;
                            const newInterval = Number(value);
                            if (
                                interval &&
                                !isNaN(newInterval) &&
                                newInterval > 1 &&
                                newInterval !== interval
                            ) {
                                if (!priorValue) {
                                    setPriorValue(interval);
                                }
                                dispatch({
                                    type: BotActionTypes.setInterval,
                                    interval: newInterval,
                                });

                                trySetInterval(
                                    newInterval,
                                    priorValue ? priorValue : interval
                                );
                            }
                        }
                    }}
                    onBlur={async (e: InputEvent) => {
                        const target = e.target as HTMLInputElement;
                        const { value } = target;
                        const newInterval = Number(value);
                        if (
                            interval &&
                            !isNaN(newInterval) &&
                            newInterval > 1 &&
                            newInterval !== interval
                        ) {
                            if (!priorValue) {
                                setPriorValue(interval);
                            }
                            dispatch({
                                type: BotActionTypes.setInterval,
                                interval: newInterval,
                            });

                            trySetInterval(
                                newInterval,
                                priorValue ? priorValue : interval
                            );
                        }
                    }}
                    placeholder="Set Interval..."
                />
            </div>
        </React.Fragment>
    );
};

export default Interval;
