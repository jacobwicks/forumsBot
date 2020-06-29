import React, { useState, useEffect, useContext } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { BotContext } from '../../../../services/BotContext';
import { BotActionTypes } from '../../../../types/Bot';
import { loadTimer } from '../../../../services/Api/services/Timer';
import usePrevious from '../../../../services/UsePrevious';

// useEffect(() => {
//     on === false &&
//         interval &&
//         botDispatch({
//             type: BotActionTypes.setTimer,
//             timer: {
//                 minutes: interval,
//                 seconds: 0,
//             },
//         });
// }, [botDispatch, interval, on]);

const Timer = () => {
    const { dispatch, settings, timer } = useContext(BotContext);
    const { minutes, seconds } = timer;
    const on = settings?.on;
    const running = settings?.running;
    const [flash, setFlash] = useState(false);
    const prevRunning = usePrevious(running);
    const prevInterval = usePrevious(settings?.interval);

    //load the timer once
    useEffect(() => {
        loadTimer(dispatch);
    }, [dispatch]);

    useEffect(() => {
        if (
            //if the bot is off, then set timer to interval
            (on === false && settings?.interval) ||
            //if the interval changes, set timer to interval
            (prevInterval &&
                settings?.interval &&
                prevInterval !== settings.interval)
        ) {
            dispatch({
                type: BotActionTypes.setTimer,
                timer: {
                    minutes: settings.interval,
                    seconds: 0,
                },
            });
        }
    }, [dispatch, prevInterval, settings, on]);

    //when the bot stops running, load the timer
    useEffect(() => {
        if (running === false && prevRunning === true) {
            loadTimer(dispatch);
        }
    }, [running, prevRunning, dispatch]);

    //tick the timer down by 1 second
    useEffect(() => {
        if (on) {
            let myInterval = setInterval(() => {
                if (seconds > 0) {
                    dispatch({
                        type: BotActionTypes.setTimer,
                        timer: {
                            minutes,
                            seconds: seconds - 1,
                        },
                    });
                }

                if (seconds === 0) {
                    if (minutes === 0) {
                        myInterval && clearInterval(myInterval);
                    } else {
                        dispatch({
                            type: BotActionTypes.setTimer,
                            timer: {
                                minutes: minutes - 1,
                                seconds: 59,
                            },
                        });
                    }
                }
            }, 1000);

            return () => {
                clearInterval(myInterval);
            };
        }
    }, [dispatch, minutes, seconds, on]);

    const noTime = minutes === 0 && seconds === 0;

    const timeout =
        noTime &&
        running &&
        setTimeout(() => {
            setFlash(!flash);
        }, 300);

    useEffect(() => {
        return () => {
            timeout && clearTimeout(timeout);
        };
    }, [timeout]);

    useEffect(() => {
        flash && (!noTime || !running) && setFlash(false);
    }, [flash, noTime, running, setFlash]);

    const getColor = () => {
        if (flash) return 'black';
        if (running && noTime) return 'lightBlue';
        if (on) return 'red';
        return 'gray';
    };

    useEffect(() => {
        //when a tab loses focus, the browser may suspend javascript operation to save cpu time
        //this means the timer interval events that tick down the seconds stop
        //so when you look again, the timer is wrong
        //listen for the focus event that occurs when the tab gets focus
        //and load the current timer from the api
        window.addEventListener('focus', () => loadTimer(dispatch));
    }, [dispatch]);

    return (
        <Segment style={{ backgroundColor: 'black', width: 120 }}>
            <Header as="h1" style={{ color: getColor() }}>
                {noTime
                    ? '00:00'
                    : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
            </Header>
        </Segment>
    );
};

export default Timer;
