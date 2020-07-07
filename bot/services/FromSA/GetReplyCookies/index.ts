import fetch from 'node-fetch';
import getCookiesFromResponse, {
    convertObjectToString,
} from '../GetCookiesFromResponse';
import { KeyString } from '../../../../types';
import { getCookies } from '../../../../services/Config';
import cheerioLoad from '../CheerioLoad';
import { showThread, replyToPost, replyToThread } from '../../Urls';
import getOptions from '../GetOptions';

const getReplyCookies = async ({
    threadId,
    postId,
}: {
    threadId?: number;
    postId?: number;
}) => {
    const cookieObject = await getCookies();

    if (!cookieObject) throw new Error();

    const cookie = convertObjectToString(cookieObject);

    const url = postId
        ? replyToPost({ postId })
        : threadId
        ? replyToThread(threadId)
        : '';

    const referrer = threadId ? showThread(threadId) : showThread();

    const options = { ...getOptions(cookie), referrer };

    const response = await fetch(url, options);

    const responseHTML = await response.text();
    const $ = cheerioLoad(responseHTML);

    const quote = $($('textarea')[0]).val();

    //formkey doesn't seem to matter.
    //if you get weird posting bugs later, start collecting it again
    //const formkey = $('input[name=formkey]').val();
    const form_cookie = $('input[name=form_cookie]').val();

    if (!threadId) {
        const threadIdString = $('.mainbodytextlarge')
            .find('a')
            .last()
            .attr('href')
            ?.split('=')[1];

        const threadIdNumber = Number(threadIdString);
        if (!threadIdString || isNaN(threadIdNumber)) {
            throw new Error('no thread id');
        }
        threadId = threadIdNumber;
    }

    const replyCookieObject = (await getCookiesFromResponse(
        response
    )) as KeyString;

    const finalCookieObject = { ...cookieObject, ...replyCookieObject };

    const replyCookie = convertObjectToString(finalCookieObject);

    return {
        cookie: replyCookie,
        cookieObject: finalCookieObject,
        form_cookie,
        quote,
        threadId,
    };
};

export default getReplyCookies;
