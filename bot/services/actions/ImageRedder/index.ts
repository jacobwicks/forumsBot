import { redden } from '../../ManipulateImage';
import makePost from '../../MakePost';
import log from '../../log';
import { PostManipulatedImageProps } from '../../../../types';
import uploadToImgur from '../../FromOther/uploadToImgur';
import { sendLogEvent } from '../../../../services/Events';

const name = 'Redden image';

const triggers = ['redder'];

//widens an image, uploads it to imgur, and posts the link
const postImageRedder = async ({
    image,
    postId,
    threadId,
}: PostManipulatedImageProps) => {
    sendLogEvent(`Reddening an image ${image}`);

    //widen the image
    const imageBuffer = await redden(image);

    if (imageBuffer) {
        //post the image anonymously to imgur
        const imageUrl = await uploadToImgur(imageBuffer);

        //generate the postcontent string by wrapping the cat url in bbCode img tags
        const content = `[img]${imageUrl}[/img]`;

        try {
            await makePost({
                content,
                postId,
                threadId,
            });
        } catch (err) {
            //if something goes wrong, then log it!
            log('imageRedder failed', { postId, threadId }, err);
        }
    } else {
        log('imageRedder failed- no imageBuffer', { postId, threadId });
    }
};

export { postImageRedder as action, name, triggers };
