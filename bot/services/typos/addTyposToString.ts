//these modules aren't ts files, and I'm not going to write types for them. It'll be ok
//I wrote them for a separate project, autoIncorrect: https://jacobwicks.github.io/autoIncorrect/
const { getResults } = require('./getResults');
const { resultArrayToString } = require('./resultArrayToString');
const { getKeyboard } = require('./getKeyboard');
const { getHomeRowIndexes } = require('./getHomeRowIndexes');

interface TypoSettings {
    extraCharacters: number;
    frequency: number;
    missedCharacters: number;
    severity: number;
    transposition: number;
}

interface TypoProps {
    inputString: string;
    settings?: TypoSettings;
}

//create a settings object
export const defaultSettings = {
    extraCharacters: 5,
    frequency: 10,
    missedCharacters: 15,
    severity: 1,
    transposition: 30,
};

const keyboardModel = {
    //the homerow is where the fingers are supposed to rest while typing
    //we use the homerow to model realistic typos, finding keys
    //on the path from the homerow to the target key
    //you can put any character from the keyboard into the homerow
    homeRow: Array.from('asdfjkl;'),

    //array of arrays of elements with upper and lower properties
    keyboard: getKeyboard(),

    //rows are offset from each other on my keyboard
    //spacebar is offset 2 full keys from 4
    //to calculate offset, get the offset of each row. Subtract the higher row from the lower
    offsets: [0, 1, 1.5, 2, 4],
};

//uses the typo generating code to introduce typos to the big title header
const addTyposToString = ({ inputString, settings }: TypoProps): string => {
    //calculate homerowIndexes and add them to the keyboardModel
    //@ts-ignore
    keyboardModel.homeRowIndexes = getHomeRowIndexes(keyboardModel);

    //use the typo functions to add typos to the header
    const resultArray = getResults({
        inputString,
        keyboardModel,
        settings: settings ? settings : defaultSettings,
    });

    //reduce it to a string
    return resultArrayToString(resultArray);
};

export default addTyposToString;
