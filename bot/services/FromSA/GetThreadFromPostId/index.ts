import { getCookieString } from '../../../../services/Config';
import { showPost, getThreadIdFromUrl } from '../../Urls';
import getSearchablePage from '../GetSearchablePage';

export const getThreadFromPostId = async (postId: number) => {
    const cookie = await getCookieString();

    if (!cookie) throw new Error('getThreadFromPostId Failed to get cookie');

    const url = showPost(postId);
    // //use postId to load post on its own
    // const url = `https://forums.somethingawful.com/showthread.php?action=showpost&postid=${postId}`;
    //on the page that loads with the signle post, there's the ? element
    //find this by class user_jump
    // <a class="user_jump" title="Show posts by this user" href="/showthread.php?threadid=3913318&amp;userid=179334">?</a>

    const $ = await getSearchablePage({ cookie, url });
    //get the element that links to the thread
    const threadUrl = $('.user_jump').attr('href');
    if (!threadUrl) return undefined;

    //get the threadId from the url
    return getThreadIdFromUrl(threadUrl);
};

export default getThreadFromPostId;
