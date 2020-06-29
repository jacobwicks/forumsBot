import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../services/Authenticate';

const routePath = '/v1/authenticate/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.sendStatus(200);
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
