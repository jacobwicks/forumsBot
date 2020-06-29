import React, { useContext } from 'react';
import { ThreadsContext } from '../../../../services/ThreadsContext';
import { ThreadsActionTypes } from '../../../../types/types';
import SideBarThread from '../SideBarThread';

const SideBarThreads = () => {
    const { dispatch, thread, threads } = useContext(ThreadsContext);

    if (!threads) return <div>No threads</div>;

    return (
        <>
            {threads.map((t, index) => {
                const { bookmarked, name, title, threadId, unreadPosts } = t;

                const selectThread = () =>
                    dispatch({
                        type: ThreadsActionTypes.currentThread,
                        threadId,
                    });

                const labelColor =
                    threadId === thread
                        ? 'green'
                        : bookmarked
                        ? 'blue'
                        : undefined;

                return (
                    <SideBarThread
                        key={index}
                        selectThread={selectThread}
                        bookmarked={bookmarked}
                        name={name}
                        title={title}
                        labelColor={labelColor}
                        unreadPosts={unreadPosts}
                    />
                );
            })}
        </>
    );
};

export default SideBarThreads;
