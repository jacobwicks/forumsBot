import { getConfig, writeToConfig } from '../index';
import { ReviewImage } from '../../../types';

export const getImageQueue = async () => {
    const config = await getConfig();
    return config?.imageQueue;
};

export const setImageQueue = async (newQueue: ReviewImage[]) => {
    const configKeys = ['imageQueue'];
    return await writeToConfig({ configKeys, value: newQueue });
};

export const addReviewImageToImageQueue = async (image: ReviewImage) => {
    const imageQueue = await getImageQueue();
    if (imageQueue) {
        imageQueue.push(image);
        await setImageQueue(imageQueue);
    }
};
