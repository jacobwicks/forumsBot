import fetch from 'node-fetch';
import getCookiesFromResponse, {
    convertObjectToString,
} from '../GetCookiesFromResponse';
import { KeyString } from '../../../../types';
import { getCookies } from '../../../../services/Config';
import cheerioLoad from '../CheerioLoad';
import {
    newReply,
    showThread,
    baseUrl,
    replyToPost,
    replyToThread,
} from '../../Urls';

const getOptions = (cookie: string) => ({
    headers: {
        accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        cookie,
    },
    referrerPolicy: 'no-referrer-when-downgrade',
    body: undefined,
    method: 'GET',
    mode: 'cors',
});

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
