import makePost from '../../MakePost';
import log from '../../log';
import { RespondToPostProps } from '../../../../types';
import { sendLogEvent } from '../../../../services/Events';

const name = 'Trump weight';

const triggers = [/\btrump\b.*?(weight|bmi|fat)/gi];

const examples = [
    'trump weight',
    'trump bmi',
    'trump fat',
    'trump weight and height',
    'trump height and weight',
];

//this is out of date, in mid-2020 the regime admitted he gained a pound
const postTrumpWeight = async ({ postId, threadId }: RespondToPostProps) => {
    sendLogEvent('posting trump weight!');

    //The postcontent strinP
    const content = `According to the NY Daily News, [url=www.nydailynews.com/news/politics/donald-trump-officially-called-fat-donald-article-1.2792346] Donald Trump can now officially be called ‘Fat Donald’[/url]. According to official US propaganda figures, the president tips the scales at a plump 243 pounds, giving him a claimed BMI of 30.1. The truth is any carnival barker's guess.`;

    try {
        await makePost({
            content,
            postId,
            threadId,
        });
    } catch (err) {
        //if something goes wrong, then log it!
        log('postTrumpWeight failed', { postId, threadId }, err);
        sendLogEvent({ error: 'Failed to post Trump Weight' });
    }
};

export { postTrumpWeight as action, name, examples, triggers };
