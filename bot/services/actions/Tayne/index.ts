import makePost from '../../MakePost';
import log from '../../log';
import { RespondToPostProps } from '../../../../types';
import { sendLogEvent } from '../../../../services/Events';

const name = 'Tayne';

const triggers = ['tayne', /hat wobble/gi];

//the tayne hat wobble
const postTayne = async ({ postId, threadId }: RespondToPostProps) => {
    sendLogEvent('posting tayne!');

    //tayne hat wobble
    const hatWobble = 'https://i.imgur.com/5oCbDFL.gif';

    //generate the postcontent string by wrapping the hat wobble url in bbCode img tags
    const content = `[img]${hatWobble}[/img]`;

    try {
        await makePost({
            content,
            postId,
            threadId,
        });
    } catch (err) {
        //if something goes wrong, then log it!
        log('postTayne failed', { postId, threadId }, err);
        sendLogEvent({ error: 'Failed to post Tayne' });
    }
};

export { postTayne as action, name, triggers };
