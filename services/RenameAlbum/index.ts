import {
    writeToConfig,
    changeKeyInConfig,
    getAlbums,
    getImageQueue,
    getApi,
} from '../Config';
import { ReviewImage, Album } from '../../types';

import fetch from 'node-fetch';

//uploads to imgur anonymously

//ok, so it looks like this goes through and gets a success response
//but it doesn't actually update the album name on imgur.
//I found a stackoverflow post from 2012 that says its not possible
//to change the album title through the api, so...
const renameAlbumOnImgur = async ({
    hash,
    name,
}: {
    hash: string;
    name: string;
}) => {
    //     curl --location --request PUT 'https://api.imgur.com/3/album/{{albumHash}}' \
    // --header 'Authorization: Bearer {{accessToken}}' \
    // --form 'deletehashes={{deleteHash}}' \
    // --form 'title=My dank meme album' \
    // --form 'description=This album contains a lot of dank memes. Be prepared.' \
    // --form 'cover={{imageHash}}'
    const accessToken = (await getApi('imgur'))?.accessToken;

    const imgurRenameUrl = `https://api.imgur.com/3/album/${hash}`;

    const response = await fetch(imgurRenameUrl, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: name }),
    });

    return response.status === 200;
};

//What happens if there's an error in the middle of this?
//well its not good! haha
const renameAlbum = async ({
    album,
    value,
}: {
    album: string;
    value: string;
}) => {
    const albums = await getAlbums();
    if (!albums) return false;
    const thisAlbum: Album = albums[album];

    //get hash of album
    const hash = thisAlbum.hash;

    //contact imgur api to rename album on imgur
    const renamedOnImgur = renameAlbumOnImgur({
        hash,
        name: value,
    });

    //if failed, give up!
    if (!renamedOnImgur) return false;

    //if successful, rename album in config
    const renamedInConfig = await changeKeyInConfig({
        configKeys: ['albums', album],
        newKey: value,
    });

    if (!renamedInConfig) return false;

    //if successful, change images to refer to new album name in config
    const imageQueue = await getImageQueue();
    const newQueue = imageQueue?.map((image: ReviewImage) =>
        image.album === album ? { ...image, album: value } : image
    );

    const imagesReferToNewAlbum = await writeToConfig({
        configKeys: ['imageQueue'],
        value: newQueue,
    });

    //if all that succeeds, respond success
    return imagesReferToNewAlbum;
};

export default renameAlbum;
