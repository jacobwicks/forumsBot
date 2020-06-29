import fetch from 'node-fetch';
import getCookiesFromResponse from '../../bot/services/FromSA/GetCookiesFromResponse';
import { setApiValue } from '../Config';

const getImgurToken = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}) => {
    const response = await fetch(
        'https://imgur.com/signin?redirect=https%3A%2F%2Fimgur.com%2F',
        {
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
            redirect: 'manual',
            referrerPolicy: 'no-referrer',
            body: `username=${username}&password=${password}&submit=`,
            method: 'POST',
            mode: 'cors',
        }
    );

    // const url = response.url;
    const cookies = getCookiesFromResponse(response);
    const accessToken = cookies?.accesstoken;
    if (accessToken) {
        setApiValue({
            api: 'imgur',
            key: 'accessToken',
            value: accessToken,
        });
        console.log(`Imgur accessToken has been set`, accessToken);
    }
    return accessToken;
};

export default getImgurToken;
