import { getThreads } from '../../../../services/Config';
import getBookmarkedThreads from '../GetBookmarkedThreads';
import getNewPostsFromThreads from '../GetNewPostsFromThreads';
import getInstructionsAndRunInstructions from '../../getInstructionsAndRunInstructions';
import { sendLogEvent } from '../../../../services/Events';

const getBookmarkedThreadsAndRunInstructions = async () => {
    sendLogEvent('getting threads...');

    // thread annotations are stored in the config file
    const threads = await getThreads();

    //this gets bookmarked threads from the SA forums
    const bookmarkedThreads = await getBookmarkedThreads();

    //generate a message
    const message = {
        text: `bot found ${bookmarkedThreads.length} thread${
            bookmarkedThreads.length !== 1 ? 's' : ''
        }`,
        threads: bookmarkedThreads,
    };
    sendLogEvent(message);

    if (!bookmarkedThreads.length) {
        sendLogEvent('bot is not monitoring any threads.');
        return;
    }

    sendLogEvent('getting posts...');

    //this gets all the unread posts from the SA forums
    const threadsAndPosts = await getNewPostsFromThreads(bookmarkedThreads);

    //should wait indicates that the last loop through made a post
    //and we need to wait for the forums cooldown timer
    let shouldWait = false;

    //process all posts in each thread
    //if it's an instruction for the bot, run it
    //use a for loop, await in forEach doesn't work as expected
    for await (const [thread, posts] of Object.entries(threadsAndPosts)) {
        //cast the key to a number
        const threadId = Number(thread);

        //if this thread has annotations,
        //find them in the thread annotations from the config file
        const thisThread = threads?.[threadId];

        //the current title of the thread, pulled from the forums
        const currentTitle = bookmarkedThreads.find(
            (t) => t.threadId === threadId
        )?.title;

        //for log events, prefer the annotated name
        const title = thisThread?.name ? thisThread.name : currentTitle;

        //handle each post in the array
        const madePost: boolean = await getInstructionsAndRunInstructions({
            //don't post on live forums
            simulate: false,

            //thread title for log events
            title,

            //the array of posts
            posts,

            //the id of this thread
            threadId,

            waitFirst: shouldWait,
        });

        shouldWait = madePost;
    }
    sendLogEvent('bot has gotten posts and handled the posts');
};

export default getBookmarkedThreadsAndRunInstructions;
