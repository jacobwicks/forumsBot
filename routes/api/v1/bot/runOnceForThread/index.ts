import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import { getRunning } from '../../../../../services/Config';
import { runOnceForThread } from '../../../../../bot/';

const routePath = '/v1/runOnceForThread/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { threadId } = req.body;

        const running = await getRunning();
        console.log(`run once, running is`, running);

        if (running) {
            res.sendStatus(200);
        } else {
            const ranBot = runOnceForThread(threadId);
            ranBot ? res.sendStatus(200) : res.sendStatus(500);
        }
    } catch (error) {
        res.status(500);
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
