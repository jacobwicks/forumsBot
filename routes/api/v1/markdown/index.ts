import { NextFunction, Request, Response, Router } from 'express';
import getMarkdown from '../../../../markdown';
import authenticate from '../../../../services/Authenticate';

const routePath = '/v1/markdown/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { keys } = req.body;

        //gets all the image albums that the bot has access to
        const markdown = await getMarkdown(keys);

        markdown ? res.send({ markdown }) : res.sendStatus(500);
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
