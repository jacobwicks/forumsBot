import fetch from 'node-fetch';
import { getCookieString } from '../../../../services/Config';

const unbookmarkThread = async (threadId: number) => {
    const body = `threadid=${threadId}&action=remove&json=1`;

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
            referrer: 'https://forums.somethingawful.com/usercp.php',
            referrerPolicy: 'no-referrer-when-downgrade',
            body,
            method: 'POST',
            mode: 'cors',
        }
    );

    const unbookmarked = response.status === 200;

    return unbookmarked;
};

export default unbookmarkThread;
