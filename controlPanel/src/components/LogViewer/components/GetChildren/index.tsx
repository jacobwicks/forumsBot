import React, { ReactElement } from 'react';
import {
    KeyStringInterface,
    LogEventTypes,
    FrontEndThread,
} from '../../../../types/types';
import ErrorEvent from '../ErrorEvent';
import ArrayDisplay from '../ArrayDisplay';
import ObjectDisplay from '../ObjectDisplay';
import Instructions from '../Instructions';
import PostMadeByBot from '../PostMadeByBot';
import { millisToMinutesAndSeconds } from '../../../../services/MillisToMinutesAndSeconds';

//processes LogEvent data, returns react elements for display in the LogViewer
const getChildren = (object: KeyStringInterface, newest?: boolean) =>
    Object.keys(object).reduce((children, key, index) => {
        switch (key) {
            case LogEventTypes.array: {
                const array = object[key];
                const child = (
                    <ArrayDisplay key={index} array={array} newest={!!newest} />
                );
                children.push(child);
                return children;
            }
            case LogEventTypes.error: {
                const child = (
                    <ErrorEvent
                        key={index}
                        newest={!!newest}
                        error={object[key]}
                    />
                );
                children.push(child);
                return children;
            }
            case LogEventTypes.instructions: {
                const child = (
                    <Instructions key={index} instructions={object[key]} />
                );
                children.push(child);
                return children;
            }
            case LogEventTypes.link: {
                const child = (
                    <a
                        key={index}
                        href={object[key]}
                        style={{ color: 'lightBlue' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Link
                    </a>
                );
                children.push(child);
                return children;
            }
            case LogEventTypes.post: {
                const child = <PostMadeByBot post={object[key]} />;
                children.push(child);
                return children;
            }
            case LogEventTypes.setting: {
                const thisSetting = object[key];
                const setting = Object.keys(thisSetting)[0];
                const child = (
                    <span key={index} style={{ color: 'pink' }}>
                        {setting} is {object[key][setting]?.toString()}
                    </span>
                );

                children.push(child);

                return children;
            }
            case LogEventTypes.text: {
                children.push(<span key={index}>{object[key]}</span>);
                return children;
            }

            case LogEventTypes.threads: {
                const threads: FrontEndThread[] = object[key];
                const displayThreads = threads.map((thread) => {
                    const { name, link, title } = thread;

                    return (
                        <div>
                            <a
                                href={link}
                                style={{ color: 'lightBlue' }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {name ? name : title}
                            </a>
                        </div>
                    );
                });

                const child = (
                    <ArrayDisplay
                        key={index}
                        array={displayThreads}
                        newest={!!newest}
                    />
                );

                children.push(child);

                return children;
            }
            case LogEventTypes.timeLeft: {
                const { minutes, seconds } = millisToMinutesAndSeconds(
                    object[key]
                );

                const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                const child = <span>Time until next bot run: {time}</span>;

                children.push(child);
                return children;
            }

            default: {
                const value = object[key];
                //the key isn't one of the recognized types, so make a generic display
                //if it's a primitive value, just display it as a key: string pair
                //if it's an array, display using ArrayDisplay
                //object but not array, use ObjectDisplay
                //ArrayDisplay and ObjectDisplay will recursively call getChildren for contents
                const display =
                    // prettier-ignore
                    typeof value === 'object'
                        ? Array.isArray(value)
                            ? <ArrayDisplay array={value} newest={!!newest} />
                            : <ObjectDisplay object={value} newest={!!newest}/>
                        : value;

                const child = (
                    <span key={index}>
                        {key}: {display}
                    </span>
                );

                children.push(child);
            }
        }
        return children;
    }, [] as ReactElement[]);

export default getChildren;
