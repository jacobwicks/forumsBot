import makePost from '../../MakePost';
import log from '../../log';
import { RespondToPostProps } from '../../../../types';
import { sendLogEvent } from '../../../../services/Events';
import getThoughts from '../../../../services/DeepAi';
import { getBotName } from '../../../../services/Config';

const name = 'Thoughts';

const triggers = [/thoughts/gi, /think/gi];

const postThoughts = async ({ post, postId, threadId }: RespondToPostProps) => {
    sendLogEvent('Getting DeepAi generated text');

    const { body } = post;
    const botName = await getBotName();

    const prompt = botName ? body.replace(botName, '') : body;

    //tayne hat wobble
    const content = await getThoughts(prompt);

    try {
        await makePost({
            content,
            postId,
            threadId,
        });
    } catch (err) {
        //if something goes wrong, then log it!
        log('postThoughts failed', { postId, threadId }, err);
        sendLogEvent({ error: 'Failed to post thoughts' });
    }
};

export { postThoughts as action, name, triggers };
