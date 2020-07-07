import { promises as fs } from 'fs';
import { ReviewImage } from '../../../types';
import * as path from 'path';

const appRoot = path.resolve(__dirname, '../../../');

const queuePath = `${appRoot}/imageQueue.json`;

export const getImageQueue = async (): Promise<ReviewImage[] | undefined> => {
    try {
        //const imageQueue = require(queuePath) as ReviewImage[];
        const imageQueue = await fs.readFile(queuePath, 'utf8');
        const parsed = JSON.parse(imageQueue);
        return parsed;
    } catch (err) {
        console.log('couldnt get imageQueue');
        console.log(err);
        //process.exit(0);
        return [];
    }
};
// export const getImageQueue = async () => {
//     const config = await getConfig();
//     return config?.imageQueue;
// };

export const setImageQueue = async (newQueue: ReviewImage[]) => {
    try {
        const stringQ = JSON.stringify(newQueue, null, 2);
        JSON.parse(stringQ);
        await fs.writeFile(queuePath, stringQ, 'utf8');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

// export const setImageQueue = async (newQueue: ReviewImage[]) => {
//     const configKeys = ['imageQueue'];
//     return await writeToConfig({ configKeys, value: newQueue });
// };

export const addReviewImageToImageQueue = async (image: ReviewImage) => {
    const imageQueue = await getImageQueue();
    if (imageQueue) {
        imageQueue.push(image);
        await setImageQueue(imageQueue);
    }
};
