export const baseUrl = 'https://forums.somethingawful.com';

export const accountPhp = `${baseUrl}/account.php`;

export const bookmarkPage = `${baseUrl}/bookmarkthreads.php`;

export const controlPanel = `${baseUrl}/usercp.php`;

export const getThreadIdFromUrl = (url: string) => {
    const threadIdParam = '/showthread.php?threadid';

    const params = new URLSearchParams(url);

    //use params to the the threadId
    //cast it to number
    const threadId = Number(params.get(threadIdParam));

    return isNaN(threadId) ? undefined : threadId;
};

//the login page for the SA forums
export const loginPage = `${baseUrl}/account.php?action=loginform`;

export const loggedOutAddress = `${baseUrl}/account.php?action=logout`;

export const newReply = `${baseUrl}/newreply.php`;

//starts a new reply to a given thread
export const replyToThread = (threadId: number) =>
    `${newReply}?action=newreply&threadid=${threadId}`;

//reply to a specific post in a given thread
export const replyToPost = ({
    postId,
    threadId,
}: {
    postId: number;
    threadId?: number;
}) =>
    threadId
        ? `${replyToThread(threadId)}&postid=${postId}`
        : `${newReply}?action=newreply&postid=${postId}`;

export const showPost = (postId: number) =>
    `${baseUrl}/showthread.php?action=showpost&postid=${postId}`;

export const showThread = (threadId?: number) =>
    threadId
        ? `${baseUrl}/showthread.php?threadid=${threadId}`
        : `${baseUrl}/showthread.php`;

export const showThreadPageNumber = ({
    threadId,
    pageNumber,
}: {
    threadId: number;
    pageNumber: number;
}) => `${showThread(threadId)}&perpage=40&pagenumber=${pageNumber}`;

//this links to the last read post in the thread
export const threadLastRead = (threadId: number) =>
    `${baseUrl}/showthread.php?threadid=${threadId}&goto=newpost`;

export const userProfile = (profile: number) =>
    `${baseUrl}/member.php?action=getinfo&userid=${profile}`;

export const threadLastPost = (threadId: number) =>
    `${baseUrl}/showthread.php?threadid=${threadId}&goto=lastpost`;
