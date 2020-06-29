import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from '../../configs/Winston';
import morgan from 'morgan';
import createRouter from '../../routes/createRouter';

const router = createRouter();

//accepts a winston logger
const createExpressApp = ({ logger }: { logger: any }) =>
    //instantiates express
    express()
        //deal with CORS
        .use(cors())
        //adds logging using winston
        //@ts-ignore
        .use((err, req, res, next) => {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // add this line to include winston logging
            winston.error(
                `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
                    req.method
                } - ${req.ip}`
            );

            // render the error page
            res.status(err.status || 500);
            res.render('error');

            next();
        })
        //it's called a body parser because it parses bodies, avi
        .use(bodyParser.urlencoded({ extended: true }))
        .use(bodyParser.json())

        //morgan logs requests
        //@ts-ignore
        .use(morgan('combined', { stream: winston.stream }))
        .use((req: Request, res: Response, next: NextFunction) => {
            //req is typed as
            //Request<ParamsDictionary, any, any, QueryString.ParsedQs>
            //it doesn't have .base or .logger properties

            //ignoring those errors
            //@ts-ignore
            req.base = `${req.protocol}://${req.get('host')}`;

            //@ts-ignore
            req.logger = logger;
            //maybe better to cast to any?
            //or figure out how to extend the type

            return next();
        })
        .use(express.static('./public'))
        //use the router created from the api folder
        .use('/api', router)
        //@ts-ignore
        .use((error, req, res, next) => {
            logger.error(error, error);
            res.status(error.status || 500).json({ error });
        });

export default createExpressApp;
