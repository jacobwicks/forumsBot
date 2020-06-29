import { writeToConfig, getApi } from '../Config';
import { Album } from '../../types';
import fetch from 'node-fetch';
//import FormData from 'form-data';

//uploads to imgur anonymously

//ok, so it looks like this goes through and gets a success response
//but it doesn't actually update the album name on imgur.
//I found a stackoverflow post from 2012 that says its not possible
//to change the album title through the api, so...
const createNewAlbumOnImgur = async ({
    album,
    description,
}: {
    album: string;
    description?: string;
}) => {
    const imgur = await getApi('imgur');
    const accessToken = imgur?.accessToken as string | undefined;

    if (!accessToken) return false;

    //     curl --location --request POST 'https://api.imgur.com/3/album' \
    // --header 'Authorization: Bearer {{accessToken}}' \
    // --form 'ids[]={{imageHash}}' \
    // --form 'title=My dank meme album' \
    // --form 'description=This albums contains a lot of dank memes. Be prepared.' \
    // --form 'cover={{imageHash}}'
    const imgurCreateNewAlbumUrl = `https://api.imgur.com/3/album/`;

    const response = await fetch(imgurCreateNewAlbumUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: album, description }),
    });

    const json = await response.json();

    const hash = json?.data?.id;

    return hash;
};

const createNewAlbum = async ({
    album,
    description,
}: {
    album: string;
    description?: string;
}) => {
    //contact imgur api to rename album on imgur
    const hash = await createNewAlbumOnImgur({
        album,
        description,
    });

    //if failed, give up!
    if (!hash) return false;

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

export default createNewAlbum;
