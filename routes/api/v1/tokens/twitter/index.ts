import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import getTwitterToken from '../../../../../services/Twitter';

const routePath = '/v1/tokens/twitter';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log('tokens/twitter called');

        const bearerToken = await getTwitterToken();

        bearerToken ? res.send({ bearerToken }) : res.sendStatus(500);
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
