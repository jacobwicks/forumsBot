import { getThreadFromPostId } from '../GetThreadFromPostId';
import getBookmarkedThreads from '../GetBookmarkedThreads';

const postIsInBookmarkedThread = async (postId: number) => {
    const threadId = await getThreadFromPostId(postId);

    if (!threadId)
        throw new Error('postIsInBookmarkedThread could not find a threadId');

    const threads = await getBookmarkedThreads();

    return threads.some((thread) => thread.threadId === threadId);
};

export default postIsInBookmarkedThread;
