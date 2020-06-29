import { glob } from 'glob';
import { Router } from 'express';

//basically, this file grabs all the individual routes from their own files in their folders
//and makes them into one router
//https://medium.com/@carlos.illobre/nodejs-express-how-to-organize-your-routes-in-very-big-applications-and-why-controllers-are-evil-e202eea497f4

const globOptions = {
    cwd: `${__dirname}/`,
    //otherwise test files are picked up when createRouter is invoked
    //which kicks up an error because they do not directly import jest
    ignore: '**/*.test.ts',
};

const createRouter = () =>
    glob
        //glob.sync grabs all the files that match the glob pattern, so all the typescript files in the directory
        .sync('**/*.ts', globOptions)

        //map to an array importing the contents of each file
        .map((filename: string) => require(`./${filename}`))

        //if the file exports a .router method, target that
        .map((exportsFromFile) =>
            !!exportsFromFile.router ? exportsFromFile.router : exportsFromFile
        )

        //if the exported contents is a Router, keep it. Otherwise filter it out
        .filter((router) => Object.getPrototypeOf(router) == Router)

        //invoke rootRouter.use on each router
        //each router will handle its own designated route
        //thus, mash all the routers together into one big router
        .reduce(
            (rootRouter, router) => rootRouter.use(router),
            Router({ mergeParams: true })
        );

export default createRouter;
