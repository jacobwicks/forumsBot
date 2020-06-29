import { postTweet } from '../Tweet';

const name = 'Trump Tweet';

const triggers = [
    "what's trumping",
    "what's trumpin",
    'whats trumping',
    'whats trumpin',
];

const postTrumpTweet = async ({
    postId,
    threadId,
}: {
    postId: number;
    threadId: number;
}) => {
    const twitterAccount = 'realdonaldtrump';
    await postTweet({ postId, threadId, twitterAccount });
};

export { postTrumpTweet as action, name, triggers };
