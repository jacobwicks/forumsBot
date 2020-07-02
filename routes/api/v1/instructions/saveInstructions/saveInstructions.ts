import { NextFunction, Request, Response, Router } from 'express';
//import authenticate from '../../../../../services/Authenticate';
import {
    changeKeyInConfig,
    saveInstructionsToFile,
    getAlbums,
    getBotName,
} from '../../../../../services/Config';
import { getActionsInstructions } from '../../../../../bot/services/actions';
import getMarkDown from '../../../../../markdown';
import getBotUserInfo from '../../../../../bot/services/FromSA/GetBotUserInfo';
import { getBookmarkedThreads } from '../../../../../bot';

const routePath = '/v1/saveInstructions/';

//writes the value to config
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

        const actions = await getActionsInstructions();

        const general = await getMarkDown(['general', 'generalInstructions']);

        const bot = await getBotUserInfo();

        const botName = await getBotName();

        const threads = await getBookmarkedThreads();

        const instructions = {
            albums,
            actions,
            bot,
            botName,
            general,
            threads,
        };

        const result = await saveInstructionsToFile(instructions);

        result ? res.sendStatus(200) : res.sendStatus(500);
    } catch (error) {
        //next(error);
        res.sendStatus(500);
    }
};

module.exports = {
    thisRoute,
    router: Router({ mergeParams: true }).get(
        routePath,
        //      authenticate,
        thisRoute
    ),
};
