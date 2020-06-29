import { Post, ImageReviewStatus, ReviewImage } from '../../../types';
import { validAlbum, addReviewImageToImageQueue } from '../../Config';

export const addImageToImageQueue = async ({
    album,
    post,
}: {
    album: string;
    post: Post;
}) => {
    const { author, date, images } = post;

    console.log('adding image to queue, images is', images);
    //if there is no image, don't add it to the queu
    if (!images || !images.length) return;

    //if the album is invalid, don't add it to the queue
    const exists = await validAlbum(album);
    if (!exists) return;

    for await (const image of images) {
        const reviewImage = {
            album,
            image,
            submittedAt: date.toString(),
            submittedBy: author,
            status: ImageReviewStatus.pending,
        } as ReviewImage;

        await addReviewImageToImageQueue(reviewImage);
    }
};
