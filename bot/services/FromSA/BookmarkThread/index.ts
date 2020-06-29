import fetch from 'node-fetch';
import { getCookieString } from '../../../../services/Config';
import { showThread } from '../../Urls';

const bookmarkThread = async (threadId: number) => {
    const body = `action=add&threadid=${threadId}&json=1`;

    const cookie = await getCookieString();
    const response = await fetch(
        'https://forums.somethingawful.com/bookmarkthreads.php',
        {
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type':
                    'application/x-www-form-urlencoded; charset=UTF-8',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest',
                cookie,
            },
            referrer: showThread(threadId),
            referrerPolicy: 'no-referrer-when-downgrade',
            body,
            method: 'POST',
            mode: 'cors',
        }
    );

    const bookmarked = response.status === 200;

    return bookmarked;
};

export default bookmarkThread;
