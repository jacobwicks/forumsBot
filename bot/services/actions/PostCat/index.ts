import fetch from 'node-fetch';
import makePost from '../../MakePost';
import log from '../../log';
import { RespondToPostProps } from '../../../../types';
import { getApi } from '../../../../services/Config';
import { sendLogEvent } from '../../../../services/Events';

const name = 'Cat Pictures';

const triggers = ['kittycat'];

//the cat API. What a wonderful service!
const catApiUrl = 'https://api.thecatapi.com/v1/images/search';

//gets a cat from the cat api
const getCat = async (): Promise<string> => {
    const options = {
        headers: {
            'X-API-KEY': await getApi('catAPI'),
        },
    };

    const res = await fetch(catApiUrl, options);
    const json = await res?.json();
    return json[0]?.url;
};

//posts a cat in response to a specific post
const postCat = async ({ postId, threadId }: RespondToPostProps) => {
    sendLogEvent(`posting a kitty cat, quoting id ${postId}`);

    const catImgSrc = await getCat();

    //generate the postcontent string by wrapping the cat url in bbCode img tags
    const content = `[img]${catImgSrc}[/img]`;

    try {
        await makePost({
            content,
            postId,
            threadId,
        });
    } catch (err) {
        sendLogEvent({ error: 'posting a kitty cat failed' });
        //if something goes wrong, then log it!
        log('postCat failed', { postId, threadId }, err);
    }
};

export { postCat as action, name, triggers };
