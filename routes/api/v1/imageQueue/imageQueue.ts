import { NextFunction, Request, Response, Router } from 'express';
import { getImageQueue } from '../../../../services/Config';
import authenticate from '../../../../services/Authenticate';

const routePath = '/v1/imageQueue/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //the images waiting for review to be added to albums
        const imageQueue = await getImageQueue();

        imageQueue ? res.send({ imageQueue }) : res.sendStatus(500);
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
