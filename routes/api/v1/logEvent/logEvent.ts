import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../../../../services/Authenticate';
import { getInterval, getRunning, getOn } from '../../../../services/Config';
import {
    getLogEvents,
    makeEvent,
    makeNewClient,
    addClient,
    removeClient,
} from '../../../../services/Events';
import {
    getTimeLeft,
    getBookmarkedThreads,
    getAnnotatedThreads,
} from '../../../../bot';

const routePath = '/v1/logEvent/';

// Middleware for GET /events endpoint
const eventsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Mandatory headers and http status to keep connection open
    const headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
    };

    //OK!
    res.writeHead(200, headers);

    //get the settings
    const interval = await getInterval();
    const running = await getRunning();
    const on = await getOn();

    const threads = await getBookmarkedThreads();
    //const threads = await getAnnotatedThreads();

    const singular = threads && threads.length === 1;
    const threadText = threads
        ? `Watching ${threads.length} thread${singular ? '' : 's'}`
        : 'Not Watching any threads';

    const timeLeft = await getTimeLeft();

    const startingEvents = [
        ...getLogEvents(),
        makeEvent({ setting: { interval } }),
        makeEvent({ setting: { on } }),
        makeEvent({ setting: { running } }),
        makeEvent({ text: threadText, threads }),
    ];

    timeLeft && startingEvents.splice(0, 2, makeEvent({ timeLeft }));

    // After client opens connection send log events, bot settings
    const data = `data: ${JSON.stringify(startingEvents)}\n\n`;

    res.write(data);

    // Generate an id based on timestamp and save res
    // object of client connection on clients list
    // Later we'll iterate it and send updates to each client
    const newClient = makeNewClient(res);

    //add the new client to the array of clients
    addClient(newClient);

    // When client closes connection we update the clients list
    // avoiding the disconnected one
    req.on('close', () => {
        console.log(`${newClient.id} Connection closed`);
        removeClient(newClient.id);
    });
};

export const thisRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        eventsHandler(req, res, next);
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
        thisRoute,
        thisRoute
    ),
};
