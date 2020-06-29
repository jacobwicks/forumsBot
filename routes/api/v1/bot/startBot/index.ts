import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import { startBot } from '../../../../../bot';
import { getRunning, getOn } from '../../../../../services/Config';

const routePath = '/v1/startBot/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const on = await getOn();
        if (on) {
            res.sendStatus(200);
        } else {
            const botStarted = await startBot();
            botStarted ? res.sendStatus(200) : res.sendStatus(500);
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
