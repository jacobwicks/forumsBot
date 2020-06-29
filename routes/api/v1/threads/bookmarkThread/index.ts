import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import bookmarkThread from '../../../../../bot/services/FromSA/BookmarkThread/';

const routePath = '/v1/bookmarkThread/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { threadId } = req.body;

        const result = await bookmarkThread(threadId);

        result ? res.sendStatus(200) : res.sendStatus(500);
    } catch (error) {
        console.log(`error on bookmarkThread`, error);
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
