import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import createNewAlbum from '../../../../../services/CreateNewAlbum';

const routePath = '/v1/createNewAlbum/';

//writes the value to config
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { album, description } = req.body;

        const hash = await createNewAlbum({
            album,
            description,
        });

        hash ? res.send({ hash }) : res.sendStatus(400);
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
