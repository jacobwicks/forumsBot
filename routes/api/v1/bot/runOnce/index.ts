import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import { runOnce } from '../../../../../bot';
import { getRunning } from '../../../../../services/Config';

const routePath = '/v1/runOnce/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const running = await getRunning();
        console.log(`run once, running is`, running);
        if (running) {
            res.sendStatus(200);
        } else {
            const ranBot = runOnce();
            ranBot ? res.sendStatus(200) : res.sendStatus(500);
        }
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
