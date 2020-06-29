import { writeToConfig, getApi } from '../Config';
import { Album } from '../../types';
import fetch from 'node-fetch';

//uploads to imgur anonymously

//ok, so it looks like this goes through and gets a success response
//but it doesn't actually update the album name on imgur.
//I found a stackoverflow post from 2012 that says its not possible
//to change the album title through the api, so...
const confirmAlbumExistsOnImgur = async (hash: string) => {
    const accessToken = (await getApi('imgur'))?.accessToken as
        | string
        | undefined;

    if (!accessToken) return false;

    // curl --location --request GET 'https://api.imgur.com/3/album/{{albumHash}}' \
    // --header 'Authorization: Client-ID {{clientId}}'
    const imgurGetAlbumUrl = `https://api.imgur.com/3/album/${hash}`;

    const response = await fetch(imgurGetAlbumUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    const json = await response.json();
    const id = json?.data?.id;
    return id && id === hash;
};

const addExistingAlbum = async ({
    album,
    description,
    hash,
}: {
    album: string;
    description?: string;
    hash: string;
}) => {
    //contact imgur api to rename album on imgur
    const albumExists = await confirmAlbumExistsOnImgur(hash);

    //if album does not exist on imgur, return false
    if (!albumExists) return false;

    const thisAlbum: Album = {
        description,
        hash,
        status: true,
    };

    //if successful, rename album in config
    const addedNewAlbumToConfig = await writeToConfig({
        allowCreateKey: true,
        configKeys: ['albums', album],
        value: thisAlbum,
    });

    if (!addedNewAlbumToConfig) return false;
    return hash;
};

export default addExistingAlbum;
