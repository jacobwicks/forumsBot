import { promises as fs } from 'fs';
import { getBotName } from '../services/Config';
import * as path from 'path';

const appRoot = path.resolve(__dirname, '../');

const baseActionKeys = ['/bot/services/actions'];

const getActionKeys = (action: string, fileName?: string) =>
    fileName
        ? [...baseActionKeys, action, fileName]
        : [...baseActionKeys, action];

export const getActionExampleMarkdown = async (action: string) => {
    try {
        if (!action)
            throw new Error('No Action Key specified for example markdown');

        const exampleKeys = getActionKeys(action, 'example');

        return await getMarkDown(exampleKeys, true);
    } catch (err) {
        console.log('Error getting action example markdown', action);
        return undefined;
    }
};

export const getActionMarkdown = async (action: string) => {
    try {
        if (!action) throw new Error('No Action Key specified for markdown');

        const instructionsKeys = getActionKeys(action, 'instructions');

        return await getMarkDown(instructionsKeys, true);
    } catch (err) {
        console.log('Error getting action markdown', action);
        return undefined;
    }
};

export const getApiMarkdown = async (api: string) => {
    try {
        if (!api) throw new Error('No Api Key specified for markdown');

        const keys = ['apis', api, 'index'];

        return await getMarkDown(keys);
    } catch (err) {
        console.log('Error getting api markdown', api);
        return undefined;
    }
};

const getMarkDown = async (
    keys: string[],
    startBlank?: boolean
): Promise<string | undefined> => {
    try {
        if (!keys || !keys.length)
            throw new Error('no keys specified for markdown');

        const markdownPath = keys.reduce(
            (path, key, index) =>
                index < keys.length - 1
                    ? (path += `${key}/`)
                    : (path += `${key}.md`),
            startBlank ? `${appRoot}` : `${appRoot}/markdown/`
        );

        //'./markdown/apis/cat/index.md';

        const markdown = await fs.readFile(markdownPath, 'utf8');

        const botName = await getBotName();

        if (botName) {
            //const botNameAdded = markdown.replace('${botName}', botName);
            const re = new RegExp(/\${botName}/g);
            const botNameAdded = markdown.replace(re, botName);
            return botNameAdded;
        }

        return markdown;
    } catch (err) {
        //console.log('Error reading markdown file', keys);
        return undefined;
    }
};

export default getMarkDown;
