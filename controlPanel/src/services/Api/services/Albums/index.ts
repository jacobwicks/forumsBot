import { authFetchJSON } from '../AuthFetch';
import {
    Albums,
    AlbumsAction,
    AlbumsActionTypes,
    ReviewImage,
} from '../../../../types/types';
import { acceptImage, loadImageQueue, rejectImage } from './Images';
import createNewAlbum from './CreateNewAlbum';
import deleteAlbum from './DeleteAlbum';

interface AlbumsResponse {
    albums: Albums;
    imageQueue: ReviewImage[];
}

type AR = AlbumsResponse | undefined;

//gets the imgur albums for the bot from the API
const getAlbums = async () => {
    const route = 'albums';
    const response = (await authFetchJSON(route)) as AR;
    const albums = response?.albums;
    const imageQueue = response?.imageQueue;

    return {
        albums,
        imageQueue,
    };
};

//loads albums into the albumsContext
const loadAlbums = async (dispatch: React.Dispatch<AlbumsAction>) => {
    dispatch({ type: AlbumsActionTypes.fetchAlbumsAttempt });
    const { albums, imageQueue } = await getAlbums();
    if (albums) {
        dispatch({
            type: AlbumsActionTypes.fetchAlbumsSuccess,
            albums,
            imageQueue,
        });
    } else dispatch({ type: AlbumsActionTypes.fetchAlbumsFailure });
};

export {
    acceptImage,
    createNewAlbum,
    deleteAlbum,
    loadImageQueue,
    loadAlbums,
    rejectImage,
};
