import { AlbumsAction, AlbumsActionTypes } from '../../../../../types/types';
import authFetch from '../../AuthFetch';

const deleteAlbumAPI = async (album: string) => {
    const route = 'deleteAlbum';
    const response = await authFetch(route, true, { album });
    return response?.status === 200;
};

const deleteAlbum = async ({
    album,
    dispatch,
}: {
    album: string;
    dispatch: React.Dispatch<AlbumsAction>;
}) => {
    dispatch({ type: AlbumsActionTypes.deleteAlbum, album });

    // const success = await deleteAlbumAPI(album);
    deleteAlbumAPI(album);

    //on failure, display toast
    //prompt user to refresh to reload album
    //requiring a refresh isn't the end of the world here
};

export default deleteAlbum;
