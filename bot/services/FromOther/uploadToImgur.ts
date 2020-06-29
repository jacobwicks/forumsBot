import fetch from 'node-fetch';
import FormData from 'form-data';
import { getApi } from '../../../services/Config';

//uploads to imgur anonymously
const uploadToImgur = async (imageFile: Buffer) => {
    const imgurUploadUrl = 'https://api.imgur.com/3/image';
    const clientId = (await getApi('imgur'))?.clientId;
    if (!clientId) throw new Error('no imgur clientId found');
    //filesize of buffer
    //buffer.byteLength
    //can't upload over 20 megs
    let newBuffer;
    if (imageFile.byteLength > 20000000) {
        console.log(`imageFile is too big for imgur`, imageFile.byteLength);
        try {
            //it's too large for imgur
            const imagemin = require('imagemin');
            const imageminJpegtran = require('imagemin-jpegtran');
            const imageminPngquant = require('imagemin-pngquant');

            const buf = await imagemin.buffer(imageFile, {
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({ quality: [0.6, 0.8] }),
                ],
            });

            console.log(`reduced to`, buf.length);
            if (buf.length < 20000000) {
                newBuffer = buf;
            }
        } catch (err) {
            console.log(err);
        }
        if (!newBuffer) return undefined;
    }

    const formData = new FormData();
    formData.append('image', newBuffer ? newBuffer : imageFile);

    const response = await fetch(imgurUploadUrl, {
        method: 'POST',
        headers: {
            Authorization: `Client-ID ${clientId}`,
        },
        body: formData,
    });

    //response.json === { data { link: string }, success, status}
    const json = await response.json();
    const link: string | undefined = json?.data?.link;
    if (!link) console.log(`imgur upload failed`, json);

    //link to uploaded img
    return link;
};

export default uploadToImgur;
