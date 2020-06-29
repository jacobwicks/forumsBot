import getNewPostsFromThread from '../GetNewPostsFromThread';
import { sendLogEvent } from '../../../../services/Events';
import getInstructionsAndRunInstructions from '../../getInstructionsAndRunInstructions';
import { getThread } from '../../../../services/Config';
import getBookmarkedThreads from '../GetBookmarkedThreads';

const getThreadAndRunInstructions = async (threadId: number) => {
    //if this thread has annotations,
    //find them in the thread annotations from the config file
    const threadNotes = await getThread(threadId);

    const posts = await getNewPostsFromThread({
        limit: undefined,
        threadId,
    });

    //eventually, get just the thread from bookmarked threads
    //eventually, if thread !bookmarked, bookmark it, run, then unbookmark it again
    const bookmarkedThreads = await getBookmarkedThreads();

    //the current title of the thread, pulled from the forums
    const currentTitle = bookmarkedThreads.find((t) => t.threadId === threadId)
        ?.title;

    //for log events, prefer the annotated name
    const title = threadNotes?.name ? threadNotes.name : currentTitle;

    //handle each post in the array
    await getInstructionsAndRunInstructions({
        //don't post on live forums
        simulate: false,

        //thread title for log events
        title,

        //the array of posts
        posts,

        //the id of this thread
        threadId,
    });
    sendLogEvent('bot has gotten posts and handled the posts');
};

export default getThreadAndRunInstructions;
