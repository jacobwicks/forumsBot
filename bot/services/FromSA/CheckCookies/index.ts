import { getCookies } from '../../../../services/Config';
import getSearchablePage from '../GetSearchablePage';
import { convertObjectToString } from '../GetCookiesFromResponse';
import { baseUrl } from '../../Urls';

const checkCookies = async () => {
    //get the cookies from the config
    const cookies = await getCookies();
    if (!cookies) return false;

    //convert the cookie object to a string that we can use to fetch
    const cookie = convertObjectToString(cookies);

    //the forums homepage
    const url = baseUrl;

    //getSearchablePage queries the forums and loads the result into cheerio
    const $ = await getSearchablePage({ cookie, url });

    //find the links elements
    const isLoggedIn = !!$('a').filter((i, node) => {
        //filter to find the logout links
        return $(node).text().trim().toLowerCase() === 'log out';
        //there should be at least one log out link on the page if you are logged in
    }).length;

    return isLoggedIn;
};

export default checkCookies;
