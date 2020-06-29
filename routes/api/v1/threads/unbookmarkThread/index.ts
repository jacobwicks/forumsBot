import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../../services/Authenticate';
import unbookmarkThread from '../../../../../bot/services/FromSA/UnbookmarkThread/';

const routePath = '/v1/unbookmarkThread/';

//lets the user login
//will eventually return a signed jwt
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //timestamp of image submission uniquely identifies
        //reviewImage object contains album string
        //so accepted image will be put in correct album
        const { threadId } = req.body;

        //acceptImage attempts to upload image to album
        //and removes it from the imageQueue in config
        const result = await unbookmarkThread(threadId);

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
