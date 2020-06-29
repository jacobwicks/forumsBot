import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../services/Authenticate';
import { changeKeyInConfig } from '../../../../services/Config';

const routePath = '/v1/setProperty/';

//writes the value to config
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { configKeys, value } = req.body;

        const result = await changeKeyInConfig({
            configKeys,
            newKey: value,
        });

        result ? res.sendStatus(200) : res.sendStatus(400);
    } catch (error) {
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
