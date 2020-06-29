import makePost from '../../MakePost';
import { RespondToPostProps } from '../../../../types';
import getRandomImageFromAlbum from '../../FromOther/getRandomImageFromAlbum';
import { getAlbumCaseInsensitive } from '../../../../services/Config';
import { sendLogEvent } from '../../../../services/Events';
import log from '../../log';
import getPostContent from '../../albums';

const triggers = [/^\bgimme\b/i, /^\bgimmie\b/i, /^give me/i];

//let { author, body, id: postId, image, instruction } = post;
const processPostFromAlbumInstruction = async ({
    instruction,
    threadId,
    postId,
}: {
    instruction: string;
    threadId: number;
    postId: number;
}) => {
    const gimme = 'gimme';

    console.log(`processing post from album`, instruction);
    //get image from collection starts with gimme
    instruction = triggers.reduce((acc, pattern) => {
        acc = acc.replace(pattern, '').trim();
        return acc;
    }, `${instruction}`);
    //instruction.replace(gimme, '').trim();

    //may say 'gimme a' or just 'gimme'
    //slice of 'a'
    instruction.trim().slice(0, 1) === 'a' &&
        (instruction = instruction.trim().slice(1));

    const album = instruction.trim();

    //albums are stored in config keyed by their titles
    //titles are human readable and set by user, so no guarantee on casing
    const thisAlbum = await getAlbumCaseInsensitive(album);

    if (thisAlbum) {
        sendLogEvent(`posting image from album ${album}`);

        const image = await getRandomImageFromAlbum(thisAlbum.hash);

        if (!image) throw new Error(`No image retreived from ${album}`);

        const content = await getPostContent({ album, image });

        try {
            await makePost({
                content,
                postId,
                threadId,
            });
        } catch (err) {
            //if something goes wrong, then log it!
            log('postFromAlbum failed', { postId, threadId }, err);
        }
    } else log('postFromAlbum Failed: bad album', album);
};

const name = 'Get Image From Album';

export { processPostFromAlbumInstruction as action, name, triggers };
