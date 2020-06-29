import cheerioLoad from '../CheerioLoad';
import fetch from 'node-fetch';

const getOptions = (cookie: string) => ({
    headers: {
        accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'upgrade-insecure-requests': '1',
        cookie,
    },
    referrerPolicy: 'no-referrer-when-downgrade',
    body: undefined,
    method: 'GET',
    mode: 'cors',
});

const getSearchablePage = async ({
    cookie,
    url,
}: {
    cookie: string;
    url: string;
}) => {
    const options = getOptions(cookie);

    const response = await fetch(url, options);

    const responseHTML = await response.text();

    const responseUrl = response.url;

    const $ = cheerioLoad(responseHTML);

    //store the url of the response in the searchable page object
    //in case we need to use it
    $.currentUrl = responseUrl;

    return $;
};

export default getSearchablePage;
