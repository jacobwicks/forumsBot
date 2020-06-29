import {
    AlbumsAction,
    ReviewImage,
    AlbumsActionTypes,
} from '../../../../../../types/types';
import { authFetchJSON } from '../../../AuthFetch';

interface ImageQueueResponse {
    imageQueue: ReviewImage[];
}

type IQR = ImageQueueResponse | undefined;

const getImageQueue = async () => {
    const route = 'imageQueue';
    return ((await authFetchJSON(route)) as IQR)?.imageQueue;
};

const loadImageQueue = async (dispatch: React.Dispatch<AlbumsAction>) => {
    dispatch({ type: AlbumsActionTypes.setFetchingImageQueue, fetching: true });

    const imageQueue = await getImageQueue();

    console.log('image queue', imageQueue);

    imageQueue &&
        dispatch({
            type: AlbumsActionTypes.setImageQueue,
            imageQueue,
        });

    dispatch({
        type: AlbumsActionTypes.setFetchingImageQueue,
        fetching: false,
    });
};

export default loadImageQueue;
