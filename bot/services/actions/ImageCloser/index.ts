import { zoom } from '../../ManipulateImage';
import makePost from '../../MakePost';
import log from '../../log';
import { PostManipulatedImageProps } from '../../../../types';
import uploadToImgur from '../../FromOther/uploadToImgur';
import { sendLogEvent } from '../../../../services/Events';

const name = 'Zoom in on Image';

const triggers = ['closer', /^zoom/];

//zooms in on an image, uploads it to imgur, and posts the link
const postImageCloser = async ({
    image,
    postId,
    threadId,
}: PostManipulatedImageProps) => {
    sendLogEvent({
        text: 'Zooming in on an image',
        link: image,
    });

    //widen the image
    const imageBuffer = await zoom(image);

    //post the image anonymously to imgur
    const imageUrl = imageBuffer && (await uploadToImgur(imageBuffer));
    sendLogEvent({ text: 'Zoomed image', link: imageUrl });
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
            sendLogEvent({ postId, threadId }, 'postImageCloser failed');
        }
    } else {
        sendLogEvent({ error: `Failed to widen image ${image}` });
    }
};

export { postImageCloser as action, name, triggers };
