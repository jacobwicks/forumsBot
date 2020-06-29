import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import { stopBot } from '../../../../../bot';
import { setRunning, setOn } from '../../../../../services/Config';

const routePath = '/v1/stopBot/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const botStopped = await stopBot();
        if (botStopped) {
            setRunning(false);
            setOn(false);
            res.sendStatus(200);
        } else res.sendStatus(500);
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
