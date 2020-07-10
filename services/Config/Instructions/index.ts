import { promises as fs } from 'fs';
import * as path from 'path';
import { replacer } from '../../JSONStringifyRegExp';
import { getAlbums } from '../Albums';
import { getActionsInstructions } from '../../../bot/services/actions';
import getMarkDown from '../../../markdown';
import getBotUserInfo from '../../../bot/services/FromSA/GetBotUserInfo';
import { getBotName } from '../Settings';
import { getBookmarkedThreads } from '../../../bot';
//const { exec } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const execCommand = async (command: string) => {
    try {
        const { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    } catch (e) {
        console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
};

const appRoot = path.resolve(__dirname, '../../../');

const instructionsPath = `${appRoot}/instructions/src/instructions.json`;

export const saveInstructionsToFile = async (instructions: any) => {
    try {
        const instructionsString = JSON.stringify(instructions, replacer, 2);
        await fs.writeFile(instructionsPath, instructionsString, 'utf8');
        console.log('executing npm run uploadInstructions script');
        await execCommand(' npm run uploadInstructions');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const getInstructionsAndSaveToFile = async () => {
    const fullAlbums = await getAlbums();
    const albums = fullAlbums
        ? Object.keys(fullAlbums)
              .filter((album) => fullAlbums[album].status)
              .map((album) => ({
                  album,
                  description: fullAlbums[album].description,
                  hash: fullAlbums[album]?.hash,
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

    return await saveInstructionsToFile(instructions);
};

export const getInstructionsHomepage = async (): Promise<
    string | undefined
> => {
    try {
        const fileString = await fs.readFile(
            `${appRoot}/instructions/package.json`,
            'utf8'
        );
        const parsed = JSON.parse(fileString);
        return parsed?.homepage;
    } catch (err) {
        return undefined;
    }
};
