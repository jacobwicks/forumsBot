import authFetch from '../../AuthFetch';
import { AlbumsAction, AlbumsActionTypes } from '../../../../../types/types';

const addExistingAlbumAPI = async ({
    album,
    hash,
    description,
}: {
    album: string;
    hash: string;
    description?: string;
}) => {
    const route = 'addExistingAlbum';

    const response = await authFetch(route, true, {
        album,
        description,
        hash,
    });

    return response?.status === 200;
};

const addExistingAlbum = async ({
    album,
    dispatch,
    description,
    hash,
}: {
    album: string;
    dispatch: React.Dispatch<AlbumsAction>;
    description?: string;
    hash: string;
}) => {
    //create the new album locally
    dispatch({
        type: AlbumsActionTypes.createNewAlbum,
        album,
        hash,
        description,
    });

    //set the current album to the new album
    dispatch({
        type: AlbumsActionTypes.setAlbum,
        album,
    });

    //ask the api to confirm that the album exists
    //and if so, add it to the albums
    const albumAdded = await addExistingAlbumAPI({ album, description, hash });

    !albumAdded &&
        dispatch({
            type: AlbumsActionTypes.deleteAlbum,
            album,
        });
};

export default addExistingAlbum;
