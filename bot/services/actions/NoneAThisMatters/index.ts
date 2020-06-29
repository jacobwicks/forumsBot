import makePost from '../../MakePost';
import log from '../../log';
import { RespondToPostProps } from '../../../../types';
import { sendLogEvent } from '../../../../services/Events';

const name = 'None a this matters';

const triggers = [/matter/gi];

const noneAThisMatters = async ({ postId, threadId }: RespondToPostProps) => {
    //a static link to the carl galaxy meme
    const content = '[img]https://i.imgur.com/yX9KZ49.jpg[/img]';

    sendLogEvent('posting none a this matters');

    try {
        await makePost({
            content,
            postId,
            threadId,
        });
    } catch (err) {
        sendLogEvent('failed to post none a this matters');
        //if something goes wrong, then log it!
        log("It don't matter. none a this matters!", { postId, threadId }, err);
    }
};

export { noneAThisMatters as action, name, triggers };
