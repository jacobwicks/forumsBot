import cheerioLoad from '../CheerioLoad';
import fetch from 'node-fetch';
import getOptions from '../GetOptions';

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
