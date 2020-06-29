import { NextFunction, Request, Response, Router } from 'express';
import { getApi } from '../../../../../services/Config';
import authenticate from '../../../../../services/Authenticate';
import getImgurToken from '../../../../../services/Imgur';

const routePath = '/v1/tokens/imgur';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, password } = req.body;

        const token = await getImgurToken({
            username,
            password,
        });

        token ? res.send({ token }) : res.sendStatus(500);
    } catch (error) {
        res.status(500);
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
