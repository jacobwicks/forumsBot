import { NextFunction, Request, Response, Router } from 'express';
import { getCreds } from '../../../../../services/Config';
import authenticate from '../../../../../services/Authenticate';

const routePath = '/v1/creds/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const creds = await getCreds();

        creds ? res.send({ creds }) : res.sendStatus(500);
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
