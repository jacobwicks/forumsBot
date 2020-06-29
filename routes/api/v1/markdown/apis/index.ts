import { NextFunction, Request, Response, Router } from 'express';
import { getApiMarkdown } from '../../../../../markdown';
import authenticate from '../../../../../services/Authenticate';

const routePath = '/v1/markdown/apis/:api';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { api } = req.params;

        const markdown = await getApiMarkdown(api);

        markdown ? res.send({ markdown }) : res.sendStatus(500);
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
