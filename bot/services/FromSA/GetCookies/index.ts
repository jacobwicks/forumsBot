const nodeFetch = require('node-fetch');
const fetch = require('fetch-cookie/node-fetch')(nodeFetch);

import getCookiesFromResponse, {
    convertObjectToString,
} from '../GetCookiesFromResponse';
import {
    getCredsUsername,
    getCredsPassword,
} from '../../../../services/Config';
import { KeyString } from '../../../../types';
import { accountPhp } from '../../Urls';
import cheerioLoad from '../CheerioLoad';

const options = {
    headers: {
        accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'content-type': 'application/x-www-form-urlencoded',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
    },
    referrer: 'https://forums.somethingawful.com/account.php?action=loginform',
    referrerPolicy: 'no-referrer-when-downgrade',
    method: 'POST',
    mode: 'cors',
};

export const testCreds = async (): Promise<boolean> => {
    const username = await getCredsUsername();
    const password = await getCredsPassword();

    const url = accountPhp;
    const body = `action=login&username=${username}&password=${password}&next=%2F`;

    //the first response we set redirect to manual
    //because some cookies are only served in the first response,
    //and we lose them if we follow the redirect
    const response = (await fetch(url, {
        ...options,
        body,
    })) as Response;

    console.log(`testCres`, response.status);

    return response.status === 200;
};

const getCookies = async ({
    asObject,
    getUserId,
}: {
    asObject?: boolean;
    getUserId?: boolean;
}): Promise<
    | KeyString
    | string
    | {
          cookies: KeyString | string;
          userId: number;
      }
> => {
    const username = await getCredsUsername();
    const password = await getCredsPassword();

    const url = accountPhp;
    const body = `action=login&username=${username}&password=${password}&next=%2F`;

    //the first response we set redirect to manual
    //because some cookies are only served in the first response,
    //and we lose them if we follow the redirect
    const response = await fetch(url, { ...options, body, redirect: 'manual' });

    //if response.status !== 200, you didn't log in

    //get the cookies from the first response
    const responseCookies = getCookiesFromResponse(response) as KeyString;

    if (!getUserId) {
        //now fetch from the account.php
        const response2 = await fetch(url, { ...options, body });
        //get the rest of the login cookies
        const response2Cookies = getCookiesFromResponse(response2) as KeyString;

        const cookieObject = { ...responseCookies, ...response2Cookies };

        return asObject ? cookieObject : convertObjectToString(cookieObject);
    } else {
        const response2 = await fetch(url, { ...options, body });
        const response2Text = await response2.text();

        const response2Cookies = getCookiesFromResponse(response2) as KeyString;
        const cookieObject = { ...responseCookies, ...response2Cookies };

        const $ = cheerioLoad(response2Text);

        const mainbodytextsmall = $('.mainbodytextsmall');
        const firstLink = $(mainbodytextsmall).find('a').first().attr('href');
        const userIdString = firstLink?.split('=').pop();
        const userId = Number(userIdString);

        return {
            cookies: asObject
                ? cookieObject
                : convertObjectToString(cookieObject),
            userId,
        };
    }
};

export default getCookies;
