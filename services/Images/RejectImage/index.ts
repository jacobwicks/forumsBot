import { getImageQueue, setImageQueue } from '../../Config';
import { ReviewImage } from '../../../types';

export const rejectImage = async (hash: number) => {
    const imageQueue = await getImageQueue();

    const newQueue = imageQueue?.filter(
        (img: ReviewImage) => img.hash !== hash
    );

    const result = newQueue ? await setImageQueue(newQueue) : false;

    return result;
};
