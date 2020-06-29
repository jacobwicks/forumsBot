import { NextFunction, Request, Response, Router } from 'express';
import { getCreds } from '../../../../../services/Config';
import authenticate from '../../../../../services/Authenticate';
import { testCreds } from '../../../../../bot/services/FromSA/GetCookies';

const routePath = '/v1/testCreds/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //res.sendStatus(200);
        // const creds = await getCreds();
        const success = await testCreds();

        success ? res.sendStatus(200) : res.sendStatus(500);
        // creds ? res.send({ creds }) : res.sendStatus(500);
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
