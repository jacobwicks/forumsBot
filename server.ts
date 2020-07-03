import winston from './configs/Winston';
import * as http from 'http';
import createExpressApp from './services/CreateExpressApp';
import { getOn, setRunning } from './services/Config';
import { runAtInterval, updateActionsInConfig } from './bot';

const port = process.env.PORT || 3001;

const app = createExpressApp({ logger: winston });

const server = http.createServer();
server
    .on('request', app)
    .on('listening', function () {
        //@ts-ignore
        const addr = this.address();
        const bind =
            typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        winston.info(`Listening on ${bind}`);
    })
    .listen(port);

const checkBotStart = async () => {
    await setRunning(false);
    await updateActionsInConfig();
    //get the 'on' value from bot settings in config
    const on = await getOn();

    if (on) {
        //run the bot every interval
        await runAtInterval();
    }
};

checkBotStart();
