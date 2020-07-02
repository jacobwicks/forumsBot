import { NextFunction, Request, Response, Router } from 'express';
import { getActionsInstructions } from '../../../../../bot/services/actions';
import { getAlbums } from '../../../../../services/Config';
import getMarkDown from '../../../../../markdown';
import getBotUserInfo from '../../../../../bot/services/FromSA/GetBotUserInfo';
import { getBookmarkedThreads } from '../../../../../bot';

//import authenticate from '../../../../services/Authenticate';

const routePath = '/v1/instructions/';

//returns the modules that the bot is running
//and the image album names
//for generating the instructions page
export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const fullAlbums = await getAlbums();
        const albums = fullAlbums
            ? Object.keys(fullAlbums)
                  .filter((album) => fullAlbums[album].status)
                  .map((album) => ({
                      album,
                      description: fullAlbums[album].description,
                  }))
            : [];

        const actions = await getActionsInstructions(true);

        const general = await getMarkDown(['general', 'generalInstructions']);

        const bot = await getBotUserInfo();

        const threads = await getBookmarkedThreads();

        res.send({ albums, actions, bot, general, threads });
    } catch (error) {
        res.status(500);
        next(error);
    }
};

module.exports = {
    thisRoute,
    router: Router({ mergeParams: true }).get(
        routePath,
        //authenticate,
        thisRoute
    ),
};
