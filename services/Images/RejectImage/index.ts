import { getImageQueue, setImageQueue } from '../../Config';
import { ReviewImage } from '../../../types';

export const rejectImage = async (submittedAt: string) => {
    const imageQueue = await getImageQueue();

    const newQueue = imageQueue?.filter(
        (img: ReviewImage) => img.submittedAt !== submittedAt
    );

    const result = newQueue ? await setImageQueue(newQueue) : false;

    return result;
};
