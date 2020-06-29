import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import { getAnnotatedThreads } from '../../../../../bot';

//returns the threads that the bot currently has bookmarked
const routePath = '/v1/threads/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const threads = await getAnnotatedThreads();

        console.log(`threads are`, threads);
        threads ? res.send({ threads }) : res.sendStatus(500);
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
