import React, { useEffect, useRef, MutableRefObject, useContext } from 'react';
import { Loader, Segment } from 'semantic-ui-react';
import LogEvent from './components/LogEvent';
import { EventsContext } from '../../services/EventsContext';

const LogViewer = ({ lines }: { lines?: number }) => {
    const { events } = useContext(EventsContext);

    const eventsEndRef = useRef(null) as MutableRefObject<any>;

    const scrollToBottom = () => {
        eventsEndRef?.current?.scrollIntoView({
            block: 'end',
            behavior: 'smooth',
        });
    };

    useEffect(scrollToBottom, [events]);

    const getHeight = () => {
        if (!lines) return 250;

        //to get the line height
        const root = document.getElementById('root');
        const text = document.createElement('span');
        text.innerHTML = 'Hello';
        //add an element containing some text
        root?.appendChild(text);

        //find the height
        const lineHeight = parseInt(window.getComputedStyle(text).fontSize, 10);
        //remove the element
        root?.removeChild(text);

        //multiply by lines + 1 to get the desired height
        return lineHeight ? lineHeight * (lines + 1) : 250;
    };

    return (
        <Segment
            style={{
                backgroundColor: 'black',
                color: 'lime',
                height: getHeight(),
                overflow: 'auto',
            }}
        >
            {!events ? (
                <Loader active />
            ) : (
                events.map((event, key) => (
                    <LogEvent
                        event={event}
                        key={key}
                        newest={key === events.length - 1}
                    />
                ))
            )}
            <div ref={eventsEndRef} />
        </Segment>
    );
};

export default LogViewer;
