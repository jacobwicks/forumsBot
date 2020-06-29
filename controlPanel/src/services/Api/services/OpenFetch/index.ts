import { apiUrl } from '../..';

interface Options {
    method: string;
    body?: string;
}

//fetch with no auth headers
const openFetch = async (
    route: string,
    post?: boolean,
    body?: string | object
) => {
    const url = `${apiUrl}${route}`;

    const options: Options = {
        method: post ? 'POST' : 'GET',
    };

    try {
        body && typeof body === 'object'
            ? (options.body = JSON.stringify(body))
            : (options.body = body);

        return fetch(url, options);
    } catch (err) {
        console.log(`authfetch caught error`, err);
        //log(err);
        return undefined;
    }
};

export const openFetchJSON = async (
    route: string,
    post?: boolean,
    body?: string | object
) => {
    //fetches
    const responsePromise = openFetch(route, post, body);

    if (!responsePromise) return undefined;

    const response = await responsePromise;

    try {
        //waits for the .json method of the response
        const json: object | undefined = await response?.json();

        //returns the json object or undefined if there was any problem
        return json;
    } catch (err) {
        //if there was an error, return undefined
        return undefined;
    }
};

export default openFetch;
