import {
    getImageQueue,
    setImageQueue,
    getAlbumCaseInsensitive,
} from '../../Config';
import { ReviewImage } from '../../../types';
import { addImageToImgurAlbum } from '../index';

export const acceptImage = async (submittedAt: string) => {
    const imageQueue = await getImageQueue();

    if (!imageQueue) return false;

    const thisImage: ReviewImage | undefined = imageQueue.find(
        (img: ReviewImage) => img.submittedAt === submittedAt
    );

    if (!thisImage) return false;

    const album = await getAlbumCaseInsensitive(thisImage.album);

    if (!album) return false;

    const uploadedUrl = await addImageToImgurAlbum({
        imageUrl: thisImage.image,
        albumHash: album.hash,
    });

    if (uploadedUrl) console.log(`accept image successfully uploaded to imgur`);

    if (!uploadedUrl) return false;

    const newQueue: ReviewImage[] = imageQueue?.filter(
        (img: ReviewImage) => img.submittedAt !== submittedAt
    );

    const imageRemovedFromQueue = newQueue
        ? await setImageQueue(newQueue)
        : false;

    if (!imageRemovedFromQueue) return false;
    return uploadedUrl;
};
