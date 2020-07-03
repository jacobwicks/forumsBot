import fetch from 'node-fetch';
import { getCookieString } from '../../../../services/Config';
import { showThread, baseUrl } from '../../Urls';

const markLastRead = async ({
    threadId,
    page,
}: {
    threadId: number;
    page: number;
}) => {
    const index = page * 40 + 1;
    const url = `${showThread()}?action=setseen&threadid=${threadId}&index=${index}`;

    const cookie = await getCookieString();
    const response = await fetch(url, {
        //@ts-ignore
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
        referrer: showThread(threadId),
        referrerPolicy: 'no-referrer-when-downgrade',
        body: undefined,
        redirect: 'manual',
        method: 'GET',
        mode: 'cors',
    });

    const success = response.status === 302;

    return success;
};

export default markLastRead;
