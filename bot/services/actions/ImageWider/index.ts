import { widen } from '../../ManipulateImage';
import makePost from '../../MakePost';
import log from '../../log';
import { PostManipulatedImageProps } from '../../../../types';
import uploadToImgur from '../../FromOther/uploadToImgur';
import { sendLogEvent } from '../../../../services/Events';

const name = 'Widen Image';

const triggers = ['wider'];

//widens an image, uploads it to imgur, and posts the link
const postImageWider = async ({
    image,
    postId,
    threadId,
}: PostManipulatedImageProps) => {
    sendLogEvent(`Widening an image ${image}`);

    //widen the image
    const imageBuffer = await widen(image);

    //post the image anonymously to imgur
    const imageUrl = imageBuffer && (await uploadToImgur(imageBuffer));

    if (imageUrl) {
        try {
            //generate the postcontent string by wrapping the image url in bbCode img tags
            const content = `[img]${imageUrl}[/img]`;

            //call makePost to use puppeteer to make the post in the requested thread
            await makePost({
                content,
                postId,
                threadId,
            });
        } catch (err) {
            //if something goes wrong, then log it!
            log('postImageWider failed', { postId, threadId }, err);
        }
    } else {
        sendLogEvent({ error: `Failed to widen image ${image}` });
    }
};

export { postImageWider as action, name, triggers };
