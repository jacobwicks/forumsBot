import { askFor } from '.';
import { promises as fs } from 'fs';
import * as path from 'path';
import { getInstructionsAndSaveToFile } from '../services/Config';
import { updateActionsInConfig } from '../bot';
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

const appRoot = path.resolve(__dirname, '../');

const blankLine = () => console.log('');

const setupInstructions = async () => {
    console.log(`This script will set up a copy of your bot instructions hosted on GitHub Pages.

    You need a github account.

    You also need to create a new git repo. The name can be anything you want.
    Just click 'create repo.' Do not initialize it with a readme.

    Hit ctrl+c to exit at any time`);
    blankLine();

    const gitHubUsername = await askFor('What is your github username?');

    if (!gitHubUsername) {
        console.log(`Github username required to complete setup. Exiting.`);
        return;
    }

    console.log(`Ok. Setup will use GitHub username ${gitHubUsername}`);
    blankLine();

    const gitRepoName = await askFor(`Now Setup needs the name of the git repo you just created.
What is the git repo name? `);

    if (!gitRepoName) {
        console.log(`Github repo name required to complete setup. Exiting.`);
        return;
    }

    console.log(`Ok. Setup will use repo name ${gitRepoName}`);
    blankLine();

    const packagePath = `${appRoot}/instructions/package.json`;
    const instructionPackage = JSON.parse(
        await fs.readFile(packagePath, 'utf8')
    );

    const homepageUrl = `http://${gitHubUsername}.github.io/${gitRepoName}`;

    instructionPackage.homepage = homepageUrl;

    const gitRepoUrl = `https://github.com/${gitHubUsername}/${gitRepoName}.git`;

    await execCommand(
        `cd .. && cd instructions && git remote set-url origin ${gitRepoUrl} && cd ..`
    );

    const instructionPackageString = JSON.stringify(
        instructionPackage,
        null,
        2
    );

    await fs.writeFile(packagePath, instructionPackageString, 'utf8');

    await updateActionsInConfig();

    //this will execute the script that uploads to github
    await getInstructionsAndSaveToFile();

    console.log(`Setup complete.
    Check the page at ${homepageUrl}. Your instructions should appear there within a few minutes.
    To confirm that a git commit was made, check the repo at ${gitRepoUrl}.`);
    process.exit(0);
};

setupInstructions();
