import { promises as fs } from 'fs';
import { ConfigJSON } from '../../types';
import { replacer, reviver } from '../JSONStringifyRegExp';
import * as path from 'path';

const appRoot = path.resolve(__dirname, '../');

const configPath = `${appRoot}/config.json`;

export const getConfig = async (): Promise<ConfigJSON | undefined> => {
    const config = await fs.readFile(configPath, 'utf8');
    try {
        return JSON.parse(config, reviver) as ConfigJSON;
    } catch (err) {
        console.log('couldnt get config- that is BAD!');
        console.log(err);
        process.exit(0);
        return undefined;
    }
};

export const getFromConfig = async (key: string | string[]): Promise<any> => {
    let value = await getConfig();

    if (value) {
        //if there's just one key, we're only going one level deep
        //@ts-ignore
        if (typeof key === 'string') value = value[key];
        //if there's an array of keys, loop through them
        else if (Array.isArray(key)) {
            //@ts-ignore
            key.forEach((k) => value && (value = value[k]));
        }
    }

    return value;
};

export const writeToConfig = async ({
    allowCreateKey,
    configKeys,
    value,
}: {
    //setting allowCreateKey to true will allow creation of new final key
    //if you want to create multi-level keys in one step, then uh, write the code to do so
    allowCreateKey?: boolean;
    configKeys: string[];
    value: any;
}) => {
    //get the current config file as a JSON object
    let config = await getConfig();

    if (config)
        try {
            //cast target to any so that we can navigate it using keys
            let target = config;
            configKeys.forEach((key, index) => {
                if (index + 1 === configKeys.length) {
                    if (allowCreateKey || target.hasOwnProperty(key)) {
                        //set the last key equal to the supplied value
                        target[key] = value;
                        //if target doesn't have the property [key]
                        //and we aren't allowed to create a key
                        //then set target to undefined
                    } else target = undefined as any;

                    //if it's not the last key, point target at the key and loop
                    //@ts-ignore
                } else target = target[key];
            });

            //if target was pointed at a bad key, don't write
            if (!target) return false;

            //can only write strings
            //replacer- a custom function that allows for serializing RegEx
            //null, 2 formats the string human readable
            const stringConfig = JSON.stringify(config, replacer, 2);

            JSON.parse(stringConfig, reviver);

            //wait for writing to config to complete
            await fs.writeFile(configPath, stringConfig, 'utf8');

            //no errors, return false
            return true;
        } catch (err) {
            //should log the error here
            console.log('produced invalid JSON');
            return false;
        }

    //no config returned, can't write to it
    return false;
};

//use this to change an existing key in the config.json file
export const changeKeyInConfig = async ({
    configKeys,
    newKey,
}: //    value,
{
    //path to the target key in Config.JSON
    configKeys: string[];

    //the desired new key
    newKey: string;
}) => {
    let config = await getConfig();

    if (config)
        try {
            //cast target to any so that we can navigate it using keys
            let target = config;

            configKeys.forEach((key, index) => {
                //go down the keys of the config file
                if (index + 1 === configKeys.length) {
                    if (target.hasOwnProperty(key)) {
                        //set the last newKey equal to the supplied value
                        // prettier-ignore
                        target[newKey] = typeof (target[key] === 'object')
                                ? Array.isArray(target[key])
                                    ? [...target[key] as Array<any>]
                                    : { ...(target[key] as object) }
                                : target[key];

                        //delete the original key
                        delete target[key];
                        //if target doesn't have the property [key]
                        //and we aren't allowed to create a key
                        //then set target to undefined
                        //@ts-ignore
                    } else target = undefined;

                    //if it's not the last key, point target at the key and loop
                    //@ts-ignore
                } else target = target[key];
            });

            //if target was pointed at a bad key, don't write
            if (!target) return false;

            //can only write strings
            //null, 2 formats the string human readable
            const stringConfig = JSON.stringify(config, replacer, 2);

            JSON.parse(stringConfig, reviver);
            //wait for writing to config to complete
            await fs.writeFile(configPath, stringConfig, 'utf8');

            //no errors, return false
            return true;
        } catch (err) {
            return false;
        }
};

export * from './Actions';
export * from './Albums';
export * from './Apis';
export * from './Cookies';
export * from './ImageQueue';
export * from './Password';
export * from './Settings';
export * from './Threads';
