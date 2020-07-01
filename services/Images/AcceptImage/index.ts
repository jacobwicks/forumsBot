import {
    getImageQueue,
    setImageQueue,
    getAlbumCaseInsensitive,
} from '../../Config';
import { ReviewImage } from '../../../types';
import { addImageToImgurAlbum } from '../index';

export const acceptImage = async (hash: number) => {
    console.log('accept image hash', hash);

    const imageQueue = await getImageQueue();

    if (!imageQueue) {
        console.log('no image queue');
        return false;
    }

    const thisImage: ReviewImage | undefined = imageQueue.find(
        (img: ReviewImage) => img.hash === hash
    );

    if (!thisImage) {
        console.log('no image found', hash);
        return false;
    }
    const album = await getAlbumCaseInsensitive(thisImage.album);

    if (!album) {
        console.log('no album');
        return false;
    }

    const uploadedUrl = await addImageToImgurAlbum({
        imageUrl: thisImage.image,
        albumHash: album.hash,
    });

    if (uploadedUrl) console.log(`accept image successfully uploaded to imgur`);

    if (!uploadedUrl) {
        console.log('not uploaded to imgur', hash);
        return false;
    }

    const newQueue: ReviewImage[] = imageQueue?.filter(
        (img: ReviewImage) => img.hash !== hash
    );

    const imageRemovedFromQueue = newQueue
        ? await setImageQueue(newQueue)
        : false;

    if (!imageRemovedFromQueue) {
        console.log('image not removed from queue', hash);
        return false;
    }
    return uploadedUrl;
};
