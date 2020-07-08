import makePost from '../../MakePost';
import getTweet from '../../FromOther/getTweet';
import { sendLogEvent } from '../../../../services/Events';

interface postTweetProps {
    postId: number;
    threadId: number;
    twitterAccount: string;
}

const name = 'Post Tweet';

const triggers = [/^@/];

//posts latest tweet from requested account
const postTweet = async ({
    postId,
    threadId,
    twitterAccount,
}: postTweetProps) => {
    sendLogEvent(`Posting tweet from ${twitterAccount}`);
    const content = await getTweet(twitterAccount);

    content
        ? await makePost({
              content,
              postId,
              threadId,
          })
        : sendLogEvent({ error: `Couldn't post tweet from ${twitterAccount}` });
};

const ignoreList = ['mitchelvii', 'cum_financial'];

const processInstruction = async ({
    postId,
    threadId,
    instruction,
}: {
    postId: number;
    threadId: number;
    instruction: string;
}) => {
    const arr = instruction.split('@');
    const twitterAccount = arr[1].trim();

    const isIgnored = ignoreList.includes(twitterAccount.toLowerCase());

    if (isIgnored) {
        sendLogEvent({
            error: `User requested tweet from ignored account ${twitterAccount}`,
        });
        console.log('ignored!', twitterAccount);
        return;
    } else await postTweet({ postId, threadId, twitterAccount });
};

export { processInstruction as action, name, postTweet, triggers };
