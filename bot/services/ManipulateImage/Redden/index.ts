import { createCanvas } from 'canvas';
import loadImage from '../../FromSA/AttachmentSafeLoadImage';

//returns number between 100 and 255
const getRedderBy = () => Math.floor(Math.random() * (255 - 100 + 1) + 100);

export const redden = async (imageUrl: string) => {
    try {
        //get the amount to redden the image by
        const redFaction = getRedderBy();

        //load image from provided url
        const image = await loadImage(imageUrl);

        //create the canvas object. Width and Height of original image
        const canvas = createCanvas(image.width, image.height);

        //2d context to manupulate image
        const context = canvas.getContext('2d');

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const originalPixels = context.getImageData(
            0,
            0,
            image.width,
            image.height
        );
        const currentPixels = context.getImageData(
            0,
            0,
            image.width,
            image.height
        );

        image.onload = null;

        if (!originalPixels) return; // Check if image has loaded

        for (
            //start at 0, go to the length of the pixel data
            let redPixel = 0, dataLength = originalPixels.data.length;
            //once we reach the end of the data, stop
            redPixel < dataLength;
            //skip forward by 4 pixels
            redPixel += 4
        ) {
            // transparent pixel = 0.
            //If it's not a transparent pixel, then increase redness
            if (currentPixels.data[redPixel + 3] > 0) {
                //divide original red channel value by 255
                //then multiply by 255 + redFaction variable, which is 100-255
                currentPixels.data[redPixel] =
                    (originalPixels.data[redPixel] / 255) * (255 + redFaction);
            }
        }

        //load reddened pixels into context
        context.putImageData(currentPixels, 0, 0);

        //create buffer from cotext
        const redImageBuffer = canvas.toBuffer();

        return redImageBuffer;
    } catch (err) {
        console.log('reddening image failed');
    }
};

export default redden;
