import React, { useContext } from 'react';
import { ThreadsContext } from '../../../../services/ThreadsContext';
import { Segment, Header, Label } from 'semantic-ui-react';
import ThreadInput from '../ThreadInput';
import { ThreadsActionTypes } from '../../../../types/types';
import {
    bookmarkThread,
    unbookmarkThread,
    loadThreads,
} from '../../../../services/Api';
import RunOnceForThreadButton from '../RunOnceForThreadButton';
import SetLastRead from '../SetLastRead';

const NoThread = () => (
    <Segment>
        <Header>No Thread Selected</Header>
    </Segment>
);

const CurrentThread = () => {
    const { dispatch, thread, threads } = useContext(ThreadsContext);

    const currentThread = threads?.find((t) => t.threadId === thread);
    if (!currentThread) return <NoThread />;

    const {
        bookmarked,
        link,
        name,
        pages,
        threadId,
        title,
        unreadPosts,
    } = currentThread;

    const style = { marginTop: 10, marginBottom: 10 };

    return (
        <>
            <Header as="h2">{name ? name : title}</Header>
            <div style={style}>
                <Label size="large" content={'threadId:'} />{' '}
                <a href={link} target="_blank" rel="noopener noreferrer">
                    {threadId}
                </a>
            </div>
            <div style={style}>
                <RunOnceForThreadButton threadId={threadId} />
            </div>
            <ThreadInput
                callback={async () =>
                    bookmarked
                        ? unbookmarkThread({ dispatch, threadId })
                        : (await bookmarkThread({ dispatch, threadId })) &&
                          loadThreads(dispatch)
                }
                checkbox
                input={'bookmarked'}
                threadId={threadId}
                value={bookmarked}
            />
            <ThreadInput
                threadId={threadId}
                input={'name'}
                type={ThreadsActionTypes.setName}
                value={name}
            />
            <div style={style}>
                <Label size="large" content={'Title:'} /> {title}
            </div>
            <div style={style}>
                <Label size="large" content={'Pages:'} />{' '}
                {pages ? pages : '???'}
            </div>
            <div style={style}>
                <Label size="large" content={'Unread Posts:'} />{' '}
                {unreadPosts !== undefined ? unreadPosts : '???'}
            </div>
            {pages && <SetLastRead threadId={threadId} />}
        </>
    );
};

export default CurrentThread;
