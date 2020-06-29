import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import renameAlbum from '../../../../../services/RenameAlbum';

const routePath = '/v1/renameAlbum/';

//writes the value to config
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { album, value } = req.body;

        const result = await renameAlbum({
            album,
            value,
        });

        result ? res.sendStatus(200) : res.sendStatus(400);
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
