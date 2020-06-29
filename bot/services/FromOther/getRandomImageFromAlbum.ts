import fetch from 'node-fetch';
import { getApi } from '../../../services/Config';
import { sendLogEvent } from '../../../services/Events';

//gets a random image from an imgur album
const getRandomImageFromAlbum = async (albumHash: string) => {
    try {
        const imgurGetAlbumUrl = `https://api.imgur.com/3/album/${albumHash}`;
        //the imgur client id
        const clientId = (await getApi('imgur'))?.clientId;

        //fetch the album information from imgur
        const response = await fetch(imgurGetAlbumUrl, {
            method: 'GET',
            headers: {
                Authorization: `Client-ID ${clientId}`,
            },
        });

        //array of the images in the album
        const images = (await response.json()).data?.images;

        //returns a random image from images
        const getRandomImage = (): string =>
            images[Math.floor(Math.random() * images.length)]?.link;

        return images && getRandomImage();
    } catch (err) {
        sendLogEvent({ error: 'Failed to get random image from album' });
        return undefined;
    }
};

export default getRandomImageFromAlbum;
