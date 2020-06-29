import getNewPostsFromThread from '../GetNewPostsFromThread';
import { sendLogEvent } from '../../../../services/Events';

export interface Post {
    //the name of the user that wrote the post
    author: SAUser;

    //the body of the post, without other quoted posts inside it
    body: string;

    //the date the post was made
    date: Date;

    //the unique postId number
    id: number;

    //the img.src property
    image?: string;

    //a link to the post
    link: string;
}

export interface SAUser {
    avatar?: string;
    id: number;
    name: string;
    title?: string;
    profile: string;
    regDate: string;
}

//limits on where to scan in a thread
export interface ThreadLimits {
    startPage: number;
    startPost?: number;
    stopPage?: number;
    stopPost?: number;
}

//a thread that the bot monitors
export interface Thread {
    //active is true if it was bookmarked
    //the last time we got bookmarked threads from the forums page
    active: boolean;

    //optional limits on scanning the thread
    //start at X page, post, stop at Y page, post
    limit?: ThreadLimits;

    //human readable name
    //designated by you, the person running the bot
    //goes in the logs
    name?: string;

    //title from the forums
    //this is often changed
    title?: string;
}

export interface ArrayThread extends Thread {
    threadId: number;
}
//gets all new posts from an array of Thread objects
//returns an object where the keys are threadIds, values are array of Post objects
const getNewPostsFromThreads = async (threads: ArrayThread[]) =>
    threads.reduce(
        async (previousPosts, thread) => {
            //reduce accumulator is a promise
            //wait for accumulator to resolve
            const allPosts = await previousPosts;

            //get thread name, id, limit
            //limit is an optional object that designates
            //where to start and stop scanning the thread
            const { limit, name, title, threadId } = thread;

            console.log(
                `scanning ${name ? name : title}, threadId ${threadId}`
            );

            sendLogEvent(
                `Scanning ${name ? name : title}, threadId ${threadId}...`
            );

            if (limit) {
                const limitString = `Scan of ${name} thread limited. \n
                Starting at page: ${limit.startPage}, post ${limit.startPost}. \n
                Stopping at page: ${limit.stopPage}, post ${limit.stopPost}.`;
                console.log(limitString);
                // sendLogEvent(limitString);
            }

            //wait for posts from the current thread
            const currentPosts = await getNewPostsFromThread({
                limit,
                threadId,
            });

            console.log(
                `there are ${currentPosts.length} new posts in the ${
                    name ? name : title
                } thread`
            );

            sendLogEvent(
                `there are ${currentPosts.length} new posts in the ${
                    name ? name : title
                } thread`
            );

            allPosts[threadId] = currentPosts;

            return allPosts;
        },
        Promise.resolve<{
            [key: number]: Post[];
        }>({})
    );

export default getNewPostsFromThreads;
