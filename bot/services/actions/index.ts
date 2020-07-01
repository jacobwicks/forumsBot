import { Glob } from 'glob';
import { Instruction, Trigger } from '../../../types';
import { sendLogEvent } from '../../../services/Events';
import {
    addActionIfNotExist,
    getActions,
    getAction,
} from '../../../services/Config';
import { replacer } from '../../../services/JSONStringifyRegExp';
import { getActionMarkdown, getActionExampleMarkdown } from '../../../markdown';

const getKey = (filename: string) => filename.split('/')[0];

interface ActionFile {
    //the action function that will be invoked
    //when the action is triggered
    action: (...args: any) => Promise<void>;

    //the action uses albums
    //this flag is used to render the instructions in the controlpanel
    albums?: boolean;

    //instructions from the optional markdown file in the action folder
    instructions?: string;

    key: string;
    name: string;

    //the action does not post
    //forums have a cooldown timer between posts
    //this flag is used to skip the post action delay
    //for actions that don't make a post
    noPost?: boolean;

    //Triggers are either a string or a regular expression
    //if an instructions matches one of the  triggers
    //then the action will be invoked
    triggers: Trigger[];
}

const getActionFileNames = () => {
    //find all typescript files in the folders
    const pattern = '**/*.ts';

    // /console.log('dirname is', __dirname);
    //we use glob to search the folders
    //these options control how it works
    const globOptions = {
        //path
        cwd: `${__dirname}`,

        //ignore test files
        ignore: '**/*.test.ts',

        //need to use the synchronous version to get a return value
        sync: true,
    };

    //instantiate the glob
    //the .found property is the array of files that glob finds
    const actions = new Glob(pattern, globOptions).found;

    return actions;
};

interface DisplayAction {
    active: boolean | undefined;
    albums: boolean;
    triggers: Trigger[];
    action: (...args: any) => Promise<void>;
    instructions?: string | undefined;
    key: string;
    name: string;
}

export const getDisplayActions = async (asString?: boolean) => {
    const fileNames = getActionFileNames();

    const exports = fileNames.map((filename) => {
        const exports = require(`../actions/${filename}`) as ActionFile;
        const key = getKey(filename);
        return {
            ...exports,
            albums: !!exports?.albums,
            key,
        };
    });

    const actionsConfig = await getActions();

    const actions = exports.reduce(
        (acc, { albums, instructions, key, name, triggers }) => {
            if (key && name) {
                const thisAction = actionsConfig?.[key];
                const active = !!thisAction?.active;
                const currentTriggers = thisAction?.triggers
                    ? thisAction.triggers
                    : triggers;

                acc[key] = {
                    albums,
                    active,
                    instructions,
                    name,
                    triggers: currentTriggers,
                };
            }
            return acc;
        },
        <
            {
                [key: string]: {
                    albums: boolean;
                    active: boolean;
                    instructions?: string;
                    name: string;
                    triggers: Trigger[];
                };
            }
        >{}
    );

    //stringify RegExp returns {}
    //so we need a replacer function to stringify it
    return asString ? JSON.stringify(actions, replacer, 2) : actions;
};

export const updateActionsInConfig = async () => {
    const actions = getActionFileNames();
    const exports = actions.map((filename: string) => {
        const exports = require(`../actions/${filename}`) as ActionFile;
        const key = getKey(filename);
        return {
            ...exports,
            key,
        };
    });

    //each action exports its name
    for await (const { key, triggers } of exports) {
        if (key && triggers) {
            //if action not in config, add it
            await addActionIfNotExist({ key, triggers });
        } else {
            return Promise.resolve(undefined);
        }
    }
};

//looks at all the folders in the actions folder
//and gets the action functions
const getActionsFromFolders = async (
    raw?: boolean
): Promise<{
    //actions can be triggered by regular expressions
    //regExps is an array of RegExp that will trigger an action
    regExps: {
        trigger: RegExp;
        noPost: boolean;
        action: (...args: any) => Promise<void>;
    }[];

    //or by a string match
    //the processor is an object with properties that return actions
    processor: {
        [key: string]: {
            action: (...args: any) => Promise<void>;
            noPost: boolean;
        };
    };
}> => {
    const actions = getActionFileNames();

    const required: ActionFile[] = actions.map((filename: string) => {
        const exports = require(`../actions/${filename}`);
        const key = getKey(filename);
        return {
            ...exports,
            key,
        };
    });

    const addConfig = async (file: ActionFile) => {
        const { key } = file;
        const configAction = await getAction(key);
        const active = configAction?.active;
        const triggers = configAction?.triggers;

        return {
            ...file,
            active,
            triggers: triggers ? triggers : file.triggers,
        };
    };

    const withConfig = await Promise.all(
        required.map((file) => addConfig(file))
    );

    const filtered = withConfig.filter((exports) => {
        const { action, active } = exports;

        //needs to export an action
        return (
            active &&
            action &&
            //action needs to be a function
            typeof action === 'function'
        );
    });

    //@ts-ignore
    if (raw) return filtered;

    return filtered.reduce(
        (acc, file) => {
            const { triggers, noPost, action } = file as ActionFile;
            triggers.forEach((trigger) => {
                if (trigger instanceof RegExp) {
                    const obj = {
                        trigger,
                        noPost: !!noPost,
                        action,
                    };
                    acc.regExps.push(obj);
                } else if (typeof trigger === 'string') {
                    const obj = {
                        action,
                        noPost: !!noPost,
                    };
                    acc.processor[trigger] = obj;
                }
            });
            return acc;
        },
        {
            regExps: <
                {
                    trigger: RegExp;
                    noPost: boolean;
                    action: (...args: any) => Promise<void>;
                }[]
            >[],

            processor: <
                {
                    [key: string]: {
                        action: (...args: any) => Promise<void>;
                        noPost: boolean;
                    };
                }
            >{},
        }
    );
};

const getHandleInstructions = async () => {
    const { regExps, processor } = await getActionsFromFolders();

    return async function ({
        instructions,
        threadId,
    }: {
        instructions: Instruction[];
        threadId: number;
    }) {
        //async await works best with for... of loops vs .forEach
        for await (const post of instructions) {
            let validInstruction = true;
            let noWait = false;
            //the args contain the whole post spread out, as well as the post object
            //most actions will only grab one or two properties
            //but some want the whole post- like add image to imageQueue
            const args = { ...post, post, postId: post.id, threadId };

            //get the properties of the post
            //let { author, body, id: postId, image, instruction } = post;
            const instruction = post.instruction.toLowerCase();

            //.find means only the first matching regex will trigger an action
            const match = regExps.find(({ trigger }) =>
                instruction.match(trigger)
            );

            //if a regExp triggers an action, don't search string triggers
            if (match) {
                const { action, noPost } = match;
                noWait = noPost;
                await action(args);
            } else {
                //relax the search a little
                //by cutting off the last character- could be punctuation
                const relaxed = instruction.slice(0, -1);

                //exact match
                if (processor[instruction]) {
                    const { action, noPost } = processor[instruction];
                    noWait = noPost;
                    await action(args);
                } // relaxed match
                else if (processor[relaxed]) {
                    const { action, noPost } = processor[relaxed];
                    noWait = noPost;
                    await action(args);
                } else {
                    validInstruction = false;
                    console.log(
                        'no match for instruction',
                        instruction,
                        relaxed
                    );
                }
            }

            //if there are multiple instructions, wait between each one
            if (instructions.length > 1) {
                if (validInstruction && !noWait) {
                    console.log(
                        `valid instruction executed. waiting 10 seconds to process next instruction`
                    );

                    sendLogEvent(
                        'valid instruction executed. waiting 10 seconds to process next instruction...'
                    );

                    await new Promise((resolve) =>
                        setTimeout(() => {
                            console.log('10 seconds for limiter elapsed');
                            resolve();
                        }, 11000)
                    );
                } else {
                    console.log(
                        noWait
                            ? 'valid instruction but no wait'
                            : `invalid instruction, not waiting`
                    );
                    sendLogEvent(
                        noWait
                            ? 'Instruction does not require wait'
                            : `Invalid instruction. Not waiting.`
                    );
                }
            }
        }
    };
};

export const getActionsInstructions = async (asString?: boolean) => {
    //@ts-ignore
    const actions = (await getActionsFromFolders(true)) as DisplayAction[];

    const actionFileNames = getActionFileNames();

    const getInstruction = async (key: string) => {
        const instructions = await getActionMarkdown(key);
        return {
            key,
            instructions,
        };
    };

    const allInstructions = await Promise.all(
        actionFileNames.map((file) => getInstruction(getKey(file)))
    );

    const getExample = async (key: string) => {
        const example = await getActionExampleMarkdown(key);
        return {
            key,
            example,
        };
    };

    const allExamples = await Promise.all(
        actionFileNames.map((file) => getExample(getKey(file)))
    );

    const actionsInstructions = actions
        .filter(({ active }) => active)
        .filter(({ name }) => name)
        .map(({ albums, key, name, triggers }) => ({
            albums,
            example: allExamples.find((el) => el.key === key)?.example,
            instructions: allInstructions.find((el) => el.key === key)
                ?.instructions,
            key,
            name,
            triggers,
        }));

    return asString
        ? JSON.stringify(actionsInstructions, replacer, 2)
        : actionsInstructions;
};

const handleInstructionsPromise = getHandleInstructions();

export default handleInstructionsPromise;
