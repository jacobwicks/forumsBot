import { NextFunction, Request, Response, Router } from 'express';
import { getInstructionsHomepage } from '../../../../../services/Config';

const routePath = '/v1/instructionsHomepage/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const homepage = await getInstructionsHomepage();
        homepage ? res.send({ homepage }) : res.sendStatus(500);
    } catch (error) {
        res.status(500);
        next(error);
    }
};

module.exports = {
    thisRoute,
    router: Router({ mergeParams: true }).get(
        routePath,
        //authenticate,
        thisRoute
    ),
};
