import { NextFunction, Request, Response, Router } from 'express';
import { getSettings, getCookies } from '../../../../services/Config';
import authenticate from '../../../../services/Authenticate';

const routePath = '/v1/settings/';

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const settings = await getSettings();
        settings && delete settings.creds;

        const cookiesExist = !!(await getCookies());

        settings &&
            (settings.cookies = {
                exist: cookiesExist,
            });

        settings ? res.send({ settings }) : res.sendStatus(500);
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
