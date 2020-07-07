import { createCanvas } from 'canvas';
import { sendLogEvent } from '../../../../services/Events';
import loadImage from '../../FromSA/AttachmentSafeLoadImage';

export const zoom = async (imageUrl: string) => {
    try {
        //how much to zoom the image
        const scale = 2;

        //load the image from the provided url
        const image = await loadImage(imageUrl);
        const { width, height } = image;

        //set width and height
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');

        var newWidth = width * scale;
        var newHeight = height * scale;

        context.translate(
            -((newWidth - width) / 2),
            -((newHeight - height) / 2)
        );
        context.scale(scale, scale);
        context.clearRect(0, 0, width, height);
        context.drawImage(canvas, 0, 0);

        //draw the image onto the canvas, this will stretch it
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        //create
        const zoomedImageBuffer = canvas.toBuffer();

        return zoomedImageBuffer;
    } catch (err) {
        console.log('widen image failed');
        sendLogEvent('Zoom image failed', imageUrl);
        return undefined;
    }
};

export default zoom;
