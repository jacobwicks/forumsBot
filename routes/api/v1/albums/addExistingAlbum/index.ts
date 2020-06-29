import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import addExistingAlbum from '../../../../../services/AddExistingAlbum';

const routePath = '/v1/addExistingAlbum/';

//writes the value to config
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { album, description, hash } = req.body;

        const albumAdded = await addExistingAlbum({
            album,
            description,
            hash,
        });

        albumAdded ? res.sendStatus(200) : res.sendStatus(400);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    thisRoute,
    router: Router({ mergeParams: true }).post(
        routePath,
        authenticate,
        thisRoute
    ),
};
