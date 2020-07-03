//import { Post, ThreadLimits } from '../../../../types';
//import { threadLastRead } from '../../urls';
//import getPageNumber from '../getPageNumber';
//import getLastPageNumber from '../getLastPageNumber';
import getPostsFromPageNumber from '../GetPostsFromPageNumber';
import getSearchablePage from '../GetSearchablePage';
import { getCookieString } from '../../../../services/Config';
import { threadLastRead } from '../../Urls';
import { Post, ThreadLimits } from '../../../../types';

//gets the number of the last page in the thread
const getLastPageNumber = async ($: any) => {
    //cut off the trailing >> characters, remove whitespace
    //cast to number
    const lastPage = Number(
        $($('[title="Last page"]')[0]).text().slice(0, -2).trim()
    );

    //if lastPage doesn't exist, it's because we are on the last page
    //and on the last page, the last page element doesn't exist
    return lastPage || getPageNumber($.currentUrl);
};

//the forums use anchor links to link to individual posts
//the url will resolve to something with the post number on the page
//https://forums.somethingawful.com/showthread.php?noseen=0&threadid=3921885&perpage=40&pagenumber=109#pti34
const getPostNumber = (url?: string) => {
    if (!url) return undefined;
    const params = new URLSearchParams(url);
    const anchor = params.get('pagenumber')?.split('#').pop();

    //lastpost indicates that we have already read all the posts in the thread
    //no anchor indicates that we haven't read any posts in the thread
    //either way, the calling function should deal with them
    if (!anchor || anchor === 'lastpost') {
        return anchor;
    } else {
        //anchor starts with 'pti', slice that off
        //convert the string to a number
        //subtract 1 for a 0 based index
        const postNumber = Number(anchor.slice(3)) - 1;

        //don't want to deal with NaN in calling function
        return postNumber === NaN ? undefined : postNumber;
    }
};

//gets the page number from the url string
const getPageNumber = (url?: string) =>
    url
        ? Number(new URLSearchParams(url).get('pagenumber')?.split('#')[0])
        : undefined;

//if no limits are provided,
//use this dummy object as the destructuring target
const noLimits = {
    startPage: undefined,
    startPost: undefined,
    stopPage: undefined,
    stopPost: undefined,
};

//gets all new posts from a thread
export const getNewPostsFromThread = async ({
    limit,
    threadId,
}: {
    //limits on what page, posts to scan
    limit?: ThreadLimits;

    //the unique id of the target thread
    threadId: number;
}): Promise<Post[]> => {
    const cookie = await getCookieString();

    //throw an error
    if (!cookie) throw new Error();

    //get limits by destructuring limit prop
    const { startPage, startPost, stopPage, stopPost } = limit || noLimits;

    //generate the last read url
    const lastReadPostUrl = threadLastRead(threadId);

    console.log(lastReadPostUrl);
    //navigate to the lastReadPost url
    const $ = await getSearchablePage({ cookie, url: lastReadPostUrl });

    //url with search parameters
    //NOTE: resolves to #lastpost if its the last post. In that case, you don't need to scan
    const resolvedUrl = $.currentUrl;

    //starting page
    //takes limit value if provided, else
    //starts on the last unread page
    const pageNumber =
        startPage !== undefined ? startPage : getPageNumber(resolvedUrl);

    //starting post
    const postNumber =
        startPost !== undefined ? startPost : getPostNumber(resolvedUrl);

    //end page
    const lastPageNumber =
        stopPage !== undefined ? stopPage : await getLastPageNumber($);

    //if the last read post was the last post in the thread, no new posts
    //return empty array
    if (postNumber === 'lastpost' || postNumber === undefined) return [];

    //if there's a page number, proceed
    if (pageNumber && lastPageNumber) {
        const remainingPages = [];

        //create an array with the pageNumbers to be scanned
        for (let page = pageNumber; page <= lastPageNumber; page++) {
            remainingPages.push(page);
        }

        console.log(`remaining pages`, remainingPages);

        //reduce the array of pageNumbers
        //to an array of the posts from those pages
        //@ts-ignore -- typescript thinks this returns a number. come on
        const posts: Post[] = await remainingPages.reduce<Promise<Post[]>>(
            //@ts-ignore
            async (
                previousPosts: Promise<Post[]>,
                currentPageNumber: number,
                index: number
            ) => {
                //reduce accumulator is a promise
                //wait for accumulator to resolve
                const allPosts = await previousPosts;

                //wait for posts from the current page number
                let currentPosts = await getPostsFromPageNumber({
                    pageNumber: currentPageNumber,
                    threadId,
                });

                //if limits defined a page and post to stop on
                //then slice the array of posts from that page
                if (
                    stopPage !== undefined &&
                    stopPost !== undefined &&
                    currentPageNumber === stopPage
                ) {
                    currentPosts = currentPosts.slice(stopPost);
                }

                //first page currentPosts will be sliced at the last read post number
                //to stop the bot from reacting twice to the same posts
                return index === 0
                    ? [...allPosts, ...currentPosts.slice(postNumber as number)]
                    : [...allPosts, ...currentPosts];
            },
            //type the accumulator as an array of Post objects
            Promise.resolve<Post[]>([])
        );

        return posts;
    } else {
        //if no page number, log error
        throw new Error('getNewPostsFromThread failed to find a pageNumber');
    }
};

export default getNewPostsFromThread;
