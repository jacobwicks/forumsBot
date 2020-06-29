import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../services/Authenticate';
import { getTimeLeft } from '../../../../bot';

const routePath = '/v1/timer/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //time until next run in milliseconds
        const timer = await getTimeLeft();

        res.send({ timer });
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
