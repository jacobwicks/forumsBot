import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import checkCookies from '../../../../../bot/services/FromSA/CheckCookies';
import getAndStoreNewCookies from '../../../../../bot/services/FromSA/GetAndStoreNewCookies';

const routePath = '/v1/refreshCookies/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refreshed = await getAndStoreNewCookies();
        refreshed ? res.sendStatus(200) : res.sendStatus(500);
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
