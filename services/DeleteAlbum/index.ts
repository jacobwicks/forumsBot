import { writeToConfig, getAlbums } from '../Config';
import { Album } from '../../types';

const deleteAlbum = async (album: string) => {
    const albums = await getAlbums();
    if (!albums) return false;
    delete albums[album];

    const configKeys = ['albums'];
    return writeToConfig({
        configKeys,
        value: albums,
    });
};

export default deleteAlbum;
