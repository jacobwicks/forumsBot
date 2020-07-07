import { loadImage } from 'canvas';
import { forumsAttachment } from '../../Urls';
import { getCookieString } from '../../../../services/Config';
import fetch from 'node-fetch';
import getOptions from '../GetOptions';

const attachmentSafeLoadImage = async (imageUrl: string | Buffer) => {
    if (
        typeof imageUrl === 'string' &&
        imageUrl.slice(0, forumsAttachment.length) === forumsAttachment
    ) {
        console.log('this is a forums attachment');
        const cookie = (await getCookieString()) as string;

        const options = getOptions(cookie);

        const response = await fetch(imageUrl, options);
        const buffer = await response.buffer();

        return loadImage(buffer);
    } else {
        return loadImage(imageUrl);
    }
};

export default attachmentSafeLoadImage;
