import { NextFunction, Request, Response, Router } from 'express';
import { getApi } from '../../../../../services/Config';
import authenticate from '../../../../../services/Authenticate';

const routePath = '/v1/api/:api';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { api: requestedApi } = req.params;

        const api = await getApi(requestedApi);
        console.log(`asked for ${requestedApi}, got`, api);

        api ? res.send({ api }) : res.sendStatus(500);
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
