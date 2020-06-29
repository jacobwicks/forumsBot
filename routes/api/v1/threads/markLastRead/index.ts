import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import { markLastRead } from '../../../../../bot/';

const routePath = '/v1/markLastRead/';

//marks the last read page in a thread
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { page, threadId } = req.body;

        const result = await markLastRead({
            page,
            threadId,
        });

        result ? res.sendStatus(200) : res.sendStatus(500);
    } catch (error) {
        console.log(`error on markLastRead`, error);
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
