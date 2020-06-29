import makePost from '../../MakePost';
import log from '../../log';
import * as smilies from '../../smilies.json';
import { RespondToPostProps } from '../../../../types';
import { sendLogEvent } from '../../../../services/Events';

const name = 'Smiley';

const triggers = ['smiley'];

//gets a smiley from the smilies
const getSmiley = () => smilies[Math.floor(Math.random() * smilies.length)];

const postSmiley = async ({ postId, threadId }: RespondToPostProps) => {
    sendLogEvent(`posting a random smiley, quoting id ${postId}`);

    const content = getSmiley();

    try {
        await makePost({
            content,
            postId,
            threadId,
        });
    } catch (err) {
        //if something goes wrong, then log it!
        log('postSmiley failed', { postId, threadId }, err);
        sendLogEvent({ error: 'Failed to post smiley' });
    }
};

const type = {
    post: false,
    pm: true,
};

export { postSmiley as action, name, triggers, type };
