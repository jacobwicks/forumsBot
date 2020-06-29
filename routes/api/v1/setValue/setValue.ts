import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../services/Authenticate';
import { writeToConfig } from '../../../../services/Config';

const routePath = '/v1/setValue/';

//writes the value to config
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { configKeys, value } = req.body;

        console.log('request to set value', configKeys, value);

        const result = await writeToConfig({
            configKeys,
            value,
        });

        console.log(`route setValue received a result`, result);
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
