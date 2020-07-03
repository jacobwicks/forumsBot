import getNewPostsFromThread from '../GetNewPostsFromThread';
import { sendLogEvent } from '../../../../services/Events';
import { ArrayThread, Post } from '../../../../types';

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
