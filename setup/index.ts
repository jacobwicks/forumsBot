import { promises as fs } from 'fs';
import { ConfigJSON } from '../types';
import * as path from 'path';
import readline from 'readline';
import { replacer } from '../services/JSONStringifyRegExp';
import { hashPromise } from '../services/Encrypt';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const askFor = (question: string): Promise<string> =>
    new Promise((resolve, reject) => {
        rl.question(`${question} `, (answer) => {
            resolve(answer.toString().trim());
        });
    });

const appRoot = path.resolve(__dirname, '../');

const blankLine = () => console.log('');

const checkForExistingConfig = async (): Promise<ConfigJSON | boolean> => {
    const configPath = `${appRoot}/config.json`;
    try {
        const config = await fs.readFile(configPath, 'utf8');
        return JSON.parse(config) as ConfigJSON;
    } catch (err) {
        return false;
    }
};

const wantModify = async (shortPrompt?: boolean): Promise<boolean> => {
    const basePrompt = `Existing config file found. 
Enter "C" to delete existing config file and create a new config file.
Enter "M" to modify existing config file, keeping all values not changed by setup.
Hit ctrl+c to exit setup.
`;
    const cmPrompt = `(C)reate new and delete existing or (M)odify existing?`;

    const prompt = shortPrompt ? cmPrompt : `${basePrompt}${cmPrompt}`;

    const response = await askFor(prompt);
    if (response.toLowerCase() === 'm') {
        console.log('Modifying existing config file...');
        return true;
    } else if (response.toLowerCase() === 'c') {
        console.log(`Creating new config file. This will delete the existing config. 
        Hit Ctrl+C to exit without deleting...`);
        return false;
    } else return await wantModify(true);
};

const getConfig = async (): Promise<ConfigJSON | undefined> => {
    const existingConfig = await checkForExistingConfig();
    let modify = false;

    if (existingConfig) {
        modify = await wantModify();
    }

    const blankConfigPath = `${appRoot}/setup/blankConfig.json`;
    const blankConfig = JSON.parse(
        await fs.readFile(blankConfigPath, 'utf8')
    ) as ConfigJSON;

    const config = modify ? (existingConfig as ConfigJSON) : blankConfig;
    return config;
};

const setup = async () => {
    const config = await getConfig();

    if (!config) {
        console.error('Could not read config template.');
        process.exit(0);
    }

    const SAUsername = await askFor(
        'What is the SA Forums Account Username the bot will use?'
    );

    if (SAUsername) {
        config.settings.creds.username = SAUsername;
        console.log(`Bot will use SA Forums Account Username ${SAUsername}
`);
    } else {
        console.log(`No SA Forums Acccount Username entered. 
Bot will not function without a valid SA Username. 
SA Username may be added in the control panel 'Creds' tab.
`);
    }

    const SAPassword = await askFor(
        'What is the SA Forums Account Password the bot will use?'
    );

    if (SAPassword) {
        config.settings.creds.password = SAPassword;
        console.log(`SA Forums Password entered.
`);
    } else {
        console.log(`No SA Forums Account password entered. 
Bot will not function without a valid SA Forums Password. 
A Password may be added in the control panel 'Creds' tab.
`);
    }

    const botNamePrompt = `The botName will be used by posters to give commands to the bot. 
If the botName was superBot, posters would command it by posting like this: "superBot, kittyCat"
What botName will the bot use?`;

    const botName = await askFor(botNamePrompt);

    if (botName) {
        config.settings.botName = botName;
        console.log(`Bot will use botName ${botName}`);
    } else {
        console.log(`No botName entered.
        Bot will not function without a botName.
        The botName may be added in the control panel 'Creds' tab.`);
    }

    blankLine();

    const password = await askFor(
        'Enter a password for the local bot control panel'
    );

    const hashedPassword = await hashPromise(password);

    config.password = hashedPassword;

    const stringConfig = JSON.stringify(config, replacer, 2);

    const configPath = `${appRoot}/config.json`;

    await fs.writeFile(configPath, stringConfig, 'utf8');

    console.log(`Config file created at ${configPath}`);

    const imageQueuePath = `${appRoot}/imageQueue.json`;

    await fs.writeFile(imageQueuePath, '[]', 'utf8');

    console.log(`Image Queue file created at ${imageQueuePath}`);

    process.exit(0);
};

setup();
