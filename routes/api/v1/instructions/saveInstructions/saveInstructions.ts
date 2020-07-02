import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import {
    changeKeyInConfig,
    saveInstructionsToFile,
} from '../../../../../services/Config';

const routePath = '/v1/saveInstructions/';

//writes the value to config
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { instructions } = req.body;

        const result = await saveInstructionsToFile({
            instructions,
        });

        result ? res.sendStatus(200) : res.sendStatus(500);
    } catch (error) {
        //next(error);
        res.sendStatus(500);
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
