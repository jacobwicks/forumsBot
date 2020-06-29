import { getConfig } from '../index';

export const getAlbums = async () => {
    const config = await getConfig();
    return config?.albums;
};

export const getAlbum = async (album: string) => {
    const albums = await getAlbums();
    return albums?.[album];
};

//albums are stored in config keyed by their titles
//titles are human readable and set by user, so no guarantee on casing
export const getAlbumCaseInsensitive = async (album: string) => {
    const albums = await getAlbums();
    const key =
        albums &&
        Object.keys(albums).find(
            (k) => k.toLowerCase() === album.toLowerCase()
        );
    return key && albums?.[key];
};

export const validAlbum = async (album: string) => {
    const exists = !!(await getAlbumCaseInsensitive(album));
    return exists;
};
