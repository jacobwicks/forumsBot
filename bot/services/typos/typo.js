const { distanceFrom } = require('./distanceFrom.js');
const { getClosestHomeRow } = require('./getClosestHomeRow.js');
const { getIndexOfCharacter } = require('./getIndexOfCharacter.js');
const { getKeysAround } = require('./getKeysAround.js');
const { getMistakeCharacter } = require('./getMistakeCharacter.js');
const { getRandomInt } = require('./getRandomInt.js');

//the typo function is called when we want to make a typo
//it takes a single character as an input, and returns a single character
const typo = ({ character, keyboardModel, settings }) => {
    const { keyboard, offsets } = keyboardModel;

    //get the index of the character
    const inputCharacterIndex = getIndexOfCharacter(character, keyboard);

    //if no index, it's not a character on our keyboard model
    //return the character unaltered
    //you could change this to a random character if you want
    if (!inputCharacterIndex) return character;

    const { row, column, isUppercase } = inputCharacterIndex;

    //get a reference to the character element in the keyboard array
    const keyboardCharacter = keyboard[row][column];

    //could add a chance of making an error with the case of the result
    const desiredCase = isUppercase ? 'upper' : 'lower';

    //the character element may have stored typos if it has been generated before
    //if there's no stored typos, generate the values
    if (!keyboardCharacter.typos) {
        // get the closest homerow index
        const { index: homerowIndex } = getClosestHomeRow(
            inputCharacterIndex,
            keyboardModel
        );

        // get the path from the closest homerow to the character
        const path =
            //spacebar is not hit with the homerow fingers, so it gets an empty array
            character === ' '
                ? []
                : distanceFrom({
                      index1: inputCharacterIndex,
                      index2: homerowIndex,
                      keyboardModel,
                      returnPath: true,
                  }).path;

        // get the keys within 1
        // some of these errors are pretty bad, because they are on the opposite side of the target
        //from the homerow key
        const keysWithin1 =
            character === ' '
                ? //spacebar has multiple columns, so it's kind of a unique case
                  //easy enough to just special case it here
                  //grab a slice of row 4
                  [...keyboard[3].slice(1, 7)]
                : getKeysAround({
                      index: inputCharacterIndex,
                      keyboard,
                      offsets,
                  });

        // get the keys within 2
        //these are very bad errors - quite far from target key
        const keysWithin2 = getKeysAround({
            index: inputCharacterIndex,
            keyboard,
            offsets,
            distance: 2,
        });

        //store generated typo possibilities in keyboard model
        //so they don't have to be generated again
        keyboardCharacter.typos = {
            path,
            keysWithin1,
            keysWithin2,
        };
    }

    const { typos } = keyboardCharacter;

    //resultCharacters start out equal to the input character
    let resultCharacters = character;

    //if a random int is less than missedCharacters
    if (getRandomInt() < settings.missedCharacters) {
        //fail to type a character at all
        resultCharacters = undefined;
    } else {
        //didn't fail to type a character, so get a mistakeCharacter
        resultCharacters = getMistakeCharacter({
            desiredCase,
            typos,
            settings,
        });
    }

    //has a chance to generate a single extra character, for 2 total
    //if you wanted to, you could add a chance to generate multiple extra chararacters
    //all the other code should handle it fine
    if (
        resultCharacters !== undefined &&
        getRandomInt() < settings.extraCharacters
    ) {
        resultCharacters += getMistakeCharacter({
            desiredCase,
            typos,
            settings,
        });
    }

    return resultCharacters;
};

exports.typo = typo;
