import React from 'react';
import {
    LogEvent as LogEventInterface,
    KeyStringInterface,
} from '../../../../types/types';
import AnimatedEllipse from '../AnimatedEllipse';
import getChildren from '../GetChildren';

function assertIsKeyStringInterface(
    data: string | KeyStringInterface
): asserts data is KeyStringInterface {
    if (!(typeof data === 'object')) {
        throw new Error('data is not a KeyStringInterface');
    }
}

//api message
//link
//post
//image
const LogEvent = ({
    event,
    newest,
}: {
    //the event from the api
    event: LogEventInterface;
    //if this event is the latest event received
    newest: boolean;
}) => {
    const { data, text } = event;

    const getPrint = () => {
        if (!data && text) {
            return text;
        } else if (typeof data === 'object') {
            assertIsKeyStringInterface(data);
            const children = getChildren(data, newest);

            return <>{children}</>;
        }
    };

    let print = getPrint();

    const time = new Date(event.time);

    const parsedTime =
        time &&
        `${(time.getHours() < 10 ? '0' : '') + time.getHours()}:${
            (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
        }:${(time.getSeconds() < 10 ? '0' : '') + time.getSeconds()}> `;

    if (newest && typeof print === 'string' && print.slice(-3) === '...') {
        print = (
            <>
                {print.slice(0, -3)}
                <AnimatedEllipse />
            </>
        );
    }
    return (
        <div>
            {time && <span style={{ color: 'yellow' }}>{parsedTime}</span>}
            {print}
        </div>
    );
};

export default LogEvent;
