import getSearchablePage from '../GetSearchablePage';
import getPostsFromPage from '../GetPostsFromPage';
import { getCookieString } from '../../../../services/Config';

export const showThread = (threadId: number) =>
    `https://forums.somethingawful.com/showthread.php?threadid=${threadId}`;

export const showThreadPageNumber = ({
    threadId,
    pageNumber,
}: {
    threadId: number;
    pageNumber: number;
}) => `${showThread(threadId)}&perpage=40&pagenumber=${pageNumber}`;

//goes to given thread on given page number
//and returns the posts from that page
const getPostsFromPageNumber = async ({
    pageNumber,
    threadId,
}: {
    pageNumber: number;
    threadId: number;
}) => {
    const cookie = await getCookieString();
    if (!cookie) throw new Error();

    //generate the url string for the thread and page number
    const url = showThreadPageNumber({
        pageNumber,
        threadId,
    });

    //navigate to the thread and page number
    const page = await getSearchablePage({ cookie, url });

    //return the posts from the current page
    return await getPostsFromPage(page);
};

export default getPostsFromPageNumber;
