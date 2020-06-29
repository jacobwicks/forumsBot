import authFetch from '../../AuthFetch';
import { ThreadsAction, ThreadsActionTypes } from '../../../../../types/types';

const bookmarkThreadApi = async (threadId: number) => {
    const route = 'bookmarkThread';

    const response = await authFetch(route, true, { threadId });

    return response?.status === 200;
};

const bookmarkThread = async ({
    dispatch,
    threadId,
}: {
    dispatch: React.Dispatch<ThreadsAction>;
    threadId: number;
}) => {
    //set bookmark locally
    dispatch({
        type: ThreadsActionTypes.setBookmarked,
        threadId,
        value: true,
    });

    const threadBookmarked = await bookmarkThreadApi(threadId);

    !threadBookmarked &&
        dispatch({
            type: ThreadsActionTypes.setBookmarked,
            threadId,
            value: false,
        });

    return threadBookmarked;
};

export default bookmarkThread;
