interface ThreadLimits {
    startPage: number;
    startPost: number;
    stopPage: number;
    stopPost: number;
}

//a thread that the bot monitors
export interface FrontEndThread {
    //active is true if it was bookmarked
    //the last time we got bookmarked threads from the forums page
    bookmarked: boolean;

    //     lastScannedPage?: number;
    //     lastScannedPost?: number;
    //     newPosts?: number;

    //optional limits on scanning the thread
    //start at X page, post, stop at Y page, post
    limit?: ThreadLimits;

    //a link to the thread
    link: string;

    //human readable name
    //designated by you, the person running the bot
    //goes in the logs
    name?: string;

    //title from the forums
    //this is often changed
    title?: string;

    //the unique identifying number of the thread
    threadId: number;

    pages: number;

    unreadPosts: number;
}

export enum ThreadsActionTypes {
    addThread = 'addThread',
    currentThread = 'currentThread',
    failed = 'failed',
    fetchAttempt = 'fetchAttempt',
    setBookmarked = 'setBookmarked',
    setName = 'setName',
    setThreads = 'setThreads',
}

export type ThreadsAction =
    //add thread or array of threads  to array of threads
    | {
          type: ThreadsActionTypes.addThread;
          thread: FrontEndThread | FrontEndThread[];
      }

    //set the current thread
    | { type: ThreadsActionTypes.currentThread; threadId: number }

    //failed to get threads from API
    | { type: ThreadsActionTypes.failed }

    //fetching threads from API
    | { type: ThreadsActionTypes.fetchAttempt }

    //set if a thread is bookmarked
    | {
          type: ThreadsActionTypes.setBookmarked;
          threadId: number;
          value: boolean;
      }

    //set the name of a thread
    | { type: ThreadsActionTypes.setName; threadId: number; value?: string }

    //set the whole array of threads
    | { type: ThreadsActionTypes.setThreads; threads: FrontEndThread[] };

export interface ThreadsDispatch {
    dispatch: React.Dispatch<ThreadsAction>;
}

interface ThreadsType {
    thread: number;
    threads?: FrontEndThread[];
    failed: boolean;
    fetching: boolean;
}

export type ThreadsState = ThreadsType & ThreadsDispatch;
