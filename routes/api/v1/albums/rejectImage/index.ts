import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import { rejectImage } from '../../../../../services/Images';

const routePath = '/v1/rejectImage/';

//lets the user login
//will eventually return a signed jwt
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //timestamp of image submission uniquely identifies image
        const { submittedAt } = req.body;

        //reject attempts to remove image from queue
        const result = await rejectImage(submittedAt);

        result ? res.sendStatus(200) : res.sendStatus(500);
    } catch (error) {
        console.log(`error on acceptImage`, error);
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
