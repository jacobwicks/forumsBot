import { NextFunction, Request, Response, Router } from 'express';
import { getApiKeys } from '../../../../services/Config';
import authenticate from '../../../../services/Authenticate';

const routePath = '/v1/apis/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const APIs = await getApiKeys();

        APIs ? res.send({ APIs }) : res.sendStatus(500);
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
