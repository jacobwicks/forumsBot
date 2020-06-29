import { NextFunction, Request, Response, Router } from 'express';
import { getActionMarkdown } from '../../../../../markdown';
import authenticate from '../../../../../services/Authenticate';

const routePath = '/v1/actionInstruction/:action';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { action } = req.params;

        const markdown = await getActionMarkdown(action);

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
