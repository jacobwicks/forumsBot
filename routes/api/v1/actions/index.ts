import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../services/Authenticate';
import { getDisplayActions } from '../../../../bot';

const routePath = '/v1/actions/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const actions = await getDisplayActions(true);

        actions ? res.send({ actions }) : res.sendStatus(500);
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
