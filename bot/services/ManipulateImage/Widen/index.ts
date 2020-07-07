import { createCanvas } from 'canvas';
import loadImage from '../../FromSA/AttachmentSafeLoadImage';

//returns 1.3 - ~ 2.3
const getWiderBy = () => 1.3 + Number(Math.random().toFixed(2));

//widens the image, returns the image data as Buffer
export const widen = async (imageUrl: string) => {
    try {
        //generate how much to widen the image
        const widerBy = getWiderBy();

        //load the image from the provided url
        const image = await loadImage(imageUrl);

        //multiply image width by widerBy variable to set canvas width
        const canvas = createCanvas(image.width * widerBy, image.height);
        const context = canvas.getContext('2d');

        //draw the image onto the canvas, this will stretch it
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        //create
        const widerImageBuffer = canvas.toBuffer();

        return widerImageBuffer;
    } catch (err) {
        console.log('widen image failed');
        return undefined;
    }
};

export default widen;
