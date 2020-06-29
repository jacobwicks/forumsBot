import { Response } from 'node-fetch';

//we need cookies to make posts
//and node-fetch is not great with cookies
//we even have to use another library, fetch-cookie to get them all

//the cookies are sent in headers as a string
//in the form "key=value; "
export const convertObjectToString = (object: { [key: string]: string }) =>
    //use Object entries to get an array
    Object.entries(object)
        .reduce((acc, cur) => {
            const [key, value] = cur;
            acc += `${key}=${value}; `;
            return acc;
        }, '')
        .trim();

const convertArrayToObject = (array: string[]) =>
    array.reduce((acc, cur) => {
        const splitOnSemicolon = cur.split(';');
        const cookiePart = splitOnSemicolon[0];

        //split on the first = sign. cookies can contain further =
        const [key, value] = cookiePart.split(/=(.+)/);

        if (value === 'deleted') {
            return acc;
        } else {
            acc[key] = value;
            return acc;
        }
    }, <{ [key: string]: string }>{});

//after making a request to the SA PHP
//we get a response
const getCookiesFromResponse = (response: Response) => {
    //if that response had cookies, they'll be in the headers under 'set-cookie'
    //if there's no set-cookie, there's no cookies.
    //to get all the cookies, instead of just the first one
    //access the raw headers
    //look in the array for the set-cookie key and the full array of cookies
    const raw = response?.headers?.raw()?.['set-cookie'];

    return convertArrayToObject(raw);
};

export default getCookiesFromResponse;
