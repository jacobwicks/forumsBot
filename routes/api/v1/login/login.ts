import { NextFunction, Request, Response, Router } from 'express';
import login from '../../../../services/Login';

const routePath = '/v1/login/';

//lets the user login
//will eventually return a signed jwt
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { password } = req.body;
        const token = await login(password);
        !token && console.log(`bad login`, password);
        token ? res.status(200).json({ token }) : res.sendStatus(400);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    thisRoute,
    router: Router({ mergeParams: true }).post(routePath, thisRoute, thisRoute),
};
