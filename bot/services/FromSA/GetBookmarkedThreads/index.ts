import getSearchablePage from '../GetSearchablePage';
import {
    getCookieString,
    getThreads,
    getThreadsArray,
    setThreadTitle,
} from '../../../../services/Config';
import { baseUrl, bookmarkPage } from '../../Urls';
import { ArrayThread } from '../../../../types';

const getBookmarkedThreads = async (url?: string): Promise<ArrayThread[]> => {
    console.log(
        `getBookmarkedThreads called ${
            url ? 'with' : 'without'
        } an override url`,
        url
    );

    const cookie = await getCookieString();
    if (!cookie) return [];

    const $ = await getSearchablePage({
        cookie,
        url: url ? url : bookmarkPage,
    });

    let threads = $('.thread')
        .map((i, thread) => {
            const titleElement = $(thread).find('.thread_title');
            const title = $(titleElement).text();

            const link = `${baseUrl}/${$(titleElement).attr('href')}`;

            const threadId = Number(titleElement.attr('href')?.split('=')[1]);

            //sometimes announcements or ads are put in the bookmark list
            //these aren't threads, don't have a threadId
            //so don't put them in the thread array!
            if (isNaN(threadId)) return;

            const pageNumbers = $(thread).find('.pagenumber');
            const pages = Number(
                $(pageNumbers[pageNumbers.length - 1])
                    .text()
                    .toLowerCase() === 'last post'
                    ? $(pageNumbers[pageNumbers.length - 2]).text()
                    : $(pageNumbers[pageNumbers.length - 1]).text()
            );

            const unreadPosts = $(thread).find('.count')
                ? Number($(thread).find('.count').text())
                : 0;

            console.log(
                `getBookmarkedThreads sees ${unreadPosts} unread posts in ${title}`
            );

            return {
                title,
                threadId,
                link,
                pages,
                unreadPosts,
            };
        })
        .toArray();

    //if there is another page of bookmarks, there will be 2 of these elements
    const nextPage = !!$("a[title|='Next page']").length;

    if (nextPage) {
        //get the href from the next page link
        const href = $($("a[title|='Next page']")[0]).attr('href');

        //create the complete url of the next page of bookmarks
        const nextPageUrl = href ? `${baseUrl}/${href}` : undefined;

        if (nextPageUrl) {
            //get the threads from the next page
            const nextThreads = await getBookmarkedThreads(nextPageUrl);

            //add them into the array of threads
            //@ts-ignore
            threads = threads.concat(nextThreads);
        } else {
            console.log('failed to find next page url');
        }
    }

    //@ts-ignore
    return threads;
};

export const getAnnotatedThreads = async () => {
    const bookmarkedThreads = (await getBookmarkedThreads()).map((thread) => ({
        ...thread,
        bookmarked: true,
    }));

    const annotations = await getThreadsArray();

    annotations?.forEach((thread) => {
        const { name, limit, title, threadId } = thread;
        const index = bookmarkedThreads.findIndex(
            (t) => t.threadId === threadId
        );

        if (index !== -1) {
            const currentTitle = bookmarkedThreads[index].title;

            if (currentTitle && currentTitle !== title) {
                //set thread title in config.json
                setThreadTitle({ threadId, title: currentTitle });
            }

            bookmarkedThreads[index] = {
                ...bookmarkedThreads[index],
                limit,
                name,
            };
        } else {
            const inactiveThread = {
                bookmarked: false,
                limit,
                name,
                title: title ? title : '???',
                threadId,
            };
            bookmarkedThreads.push(inactiveThread);
        }
    });

    return bookmarkedThreads;
};

export default getBookmarkedThreads;
