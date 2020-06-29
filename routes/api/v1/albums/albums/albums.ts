import { NextFunction, Request, Response, Router } from 'express';
import { getAlbums, getImageQueue } from '../../../../../services/Config';
import authenticate from '../../../../../services/Authenticate';

const routePath = '/v1/albums/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //gets all the image albums that the bot has access to
        const albums = await getAlbums();
        //the images waiting for review to be added to albums
        const imageQueue = await getImageQueue();

        albums && imageQueue
            ? res.send({ albums, imageQueue })
            : res.sendStatus(500);
    } catch (error) {
        res.status(500);
        next(error);
    }
};

module.exports = {
    thisRoute,
    router: Router({ mergeParams: true }).get(
        routePath,
        authenticate,
        thisRoute
    ),
};
