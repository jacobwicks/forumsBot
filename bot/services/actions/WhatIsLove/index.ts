import makePost from '../../MakePost';
import log from '../../log';
import { RespondToPostProps } from '../../../../types';
import { sendLogEvent } from '../../../../services/Events';

const name = 'What is Love?';

const triggers = ['what is love'];

const whatIsLove = async ({ postId, threadId }: RespondToPostProps) => {
    sendLogEvent('posting roxbury head bob!');

    //night at the roxbury car
    const roxbury = 'https://i.imgur.com/qXcDIBl.gif';

    //generate the postcontent string by wrapping the roxbury url in bbCode img tags
    const content = `[img]${roxbury}[/img]`;

    try {
        await makePost({
            content,
            postId,
            threadId,
        });
    } catch (err) {
        //if something goes wrong, then log it!
        log('what Is Love failed', { postId, threadId }, err);
        sendLogEvent({ error: 'Failed to post what is love' });
    }
};

export { whatIsLove as action, name, triggers };
