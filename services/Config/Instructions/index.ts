import { promises as fs } from 'fs';
import * as path from 'path';
import { replacer } from '../../JSONStringifyRegExp';
import { exec } from 'child_process';
import { series } from 'async';
// const {exec} = require('child_process');

// series([
//  exec('npm run dev'),
//  exec('npm run test')
// ]);

const appRoot = path.resolve(__dirname, '../../../');

const instructionsPath = `${appRoot}/instructions/src/instructions.json`;

export const saveInstructionsToFile = async (instructions: any) => {
    try {
        const instructionsString = JSON.stringify(instructions, replacer, 2);
        await fs.writeFile(instructionsPath, instructionsString, 'utf8');
        exec('npm run uploadInstructions');
        return true;
    } catch (err) {
        return false;
    }
};
