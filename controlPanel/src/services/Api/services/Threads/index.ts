import {
    FrontEndThread,
    ThreadsAction,
    ThreadsActionTypes,
} from '../../../../types/types';
import { authFetchJSON } from '../AuthFetch';
import unbookmarkThread from './UnbookmarkThread';
import bookmarkThread from './BookmarkThread';
import markLastRead from './MarkLastRead';

interface ThreadsResponse {
    threads: FrontEndThread[];
}

type TR = ThreadsResponse | undefined;

//gets the imgur albums for the bot from the API
const getThreads = async () => {
    const route = 'threads';
    const response = (await authFetchJSON(route)) as TR;
    const threads = response?.threads;

    return threads;
};

//loads albums into the albumsContext
const loadThreads = async (dispatch: React.Dispatch<ThreadsAction>) => {
    dispatch({ type: ThreadsActionTypes.fetchAttempt });
    const threads = await getThreads();
    if (threads) {
        dispatch({
            type: ThreadsActionTypes.setThreads,
            threads,
        });
    } else dispatch({ type: ThreadsActionTypes.failed });
};

export { bookmarkThread, loadThreads, markLastRead, unbookmarkThread };
