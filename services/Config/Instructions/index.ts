import { promises as fs } from 'fs';
import * as path from 'path';
import { replacer } from '../../JSONStringifyRegExp';

const appRoot = path.resolve(__dirname, '../../../');

const instructionsPath = `${appRoot}/instructions.json`;

export const saveInstructionsToFile = async (instructions: any) => {
    try {
        const instructionsString = JSON.stringify(
            instructions?.instructions,
            replacer,
            2
        );
        await fs.writeFile(instructionsPath, instructionsString, 'utf8');
        return true;
    } catch (err) {
        return false;
    }
};
