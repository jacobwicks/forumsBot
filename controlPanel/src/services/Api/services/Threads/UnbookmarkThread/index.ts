import authFetch from '../../AuthFetch';
import { ThreadsAction, ThreadsActionTypes } from '../../../../../types/types';

const unbookmarkThreadApi = async (threadId: number) => {
    const route = 'unbookmarkThread';

    const response = await authFetch(route, true, { threadId });

    return response?.status === 200;
};

const unbookmarkThread = async ({
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
        value: false,
    });

    const threadUnbookmarked = await unbookmarkThreadApi(threadId);

    !threadUnbookmarked &&
        dispatch({
            type: ThreadsActionTypes.setBookmarked,
            threadId,
            value: true,
        });
};

export default unbookmarkThread;
