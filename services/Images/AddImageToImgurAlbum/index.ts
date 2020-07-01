import FormData from 'form-data';
import fetch from 'node-fetch';
import { promisify } from 'util';
import { getApi } from '../../Config';

export const addImageToImgurAlbum = async ({
    imageUrl,
    albumHash,
}: {
    //url of the image to be uploaded
    imageUrl: string;

    //imgur hash for the album
    albumHash: string;
}) => {
    //turn encoding off to get an imageBuffer instead of string
    const request = require('request').defaults({ encoding: null });

    //use get() to load image from provided url
    //make it a promise with promisify
    const requestPromise = promisify(request.get);

    //wait for the promise to resolve, load the body
    const imageBuffer = (await requestPromise(imageUrl))?.body;

    if (imageBuffer) {
        const accessToken = (await getApi('imgur'))?.accessToken;

        if (!accessToken) return undefined;

        const imgurUploadToAlbumUrl = `https://api.imgur.com/3/image/`;

        const formData = new FormData();
        formData.append('image', imageBuffer);
        formData.append('album', albumHash);

        const response = await fetch(imgurUploadToAlbumUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        console.log('imgur upload status', response.status);

        //response.json === { data { link: string }, success, status}
        const json = await response.json();
        if (response.status !== 200) {
            console.log(json);
        }
        //link to uploaded img
        const link: string | undefined = json?.data?.link;

        return link;
    } else return undefined;
};
