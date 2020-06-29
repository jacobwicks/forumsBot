import { NextFunction, Request, Response, Router } from 'express';
import { getBotName } from '../../../../services/Config';

const routePath = '/v1/botname/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const botName = await getBotName();

        botName ? res.send({ botName }) : res.sendStatus(500);
    } catch (error) {
        res.status(500);
        next(error);
    }
};

module.exports = {
    thisRoute,
    router: Router({ mergeParams: true }).get(routePath, thisRoute),
};
