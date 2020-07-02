import { promises as fs } from 'fs';
import * as path from 'path';
import { replacer } from '../../JSONStringifyRegExp';
const { exec } = require('child_process');

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
        console.log('going execute script');
        exec(
            'npm run uploadInstructions',
            (error: any, stdout: any, stderr: any) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            }
        );

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};
