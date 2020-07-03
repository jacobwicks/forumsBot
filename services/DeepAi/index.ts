//@ts-ignore
import deepAi from 'deepai'; // OR include deepai.min.js as a script tag in your HTML
import { getApi } from '../Config';

//gets the requested index of a pattern in a string
//use it to find the third period in the return value
const nthIndex = (str: string, pattern: string, n: number) => {
    const stringLength = str.length;
    let index = -1;

    while (n-- && index++ < stringLength) {
        index = str.indexOf(pattern, index);
        if (index < 0) break;
    }

    return index;
};

const noThoughts =
    'After careful consideration, I have no thoughts on the matter.';

const getThoughts = async (text: string) => {
    try {
        const apiKey = await getApi('deepAi');

        if (!apiKey) return noThoughts;

        deepAi.setApiKey(apiKey);

        const resp:
            | { output: string }
            | undefined = await deepAi.callStandardApi('text-generator', {
            text,
        });

        const output = resp?.output;

        if (!output) return noThoughts;

        const split = output.split(/\r?\n/);

        const toPrint = split
            .slice(1)
            .filter((v) => v)
            .slice(0, 3)
            .reduce((acc, cur) => (acc += cur), '');

        const end = nthIndex(toPrint, '.', 3);

        const thoughts = toPrint.slice(0, end + 1);

        return thoughts;
    } catch (err) {
        return noThoughts;
    }
};

export default getThoughts;
