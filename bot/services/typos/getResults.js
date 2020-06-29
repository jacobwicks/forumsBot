const { getRandomInt } = require('./getRandomInt.js');
const { typo } = require('./typo.js');

//getResults takes an input string and returns a resultArray
//resultArray contains elements with { inputCharacter, resultCharacter }
const getResults = ({ inputString, keyboardModel, settings }) =>
    inputString &&
    //use Array.from to make an array
    //then use Array.reduce to return the result character
    //resultCharacters will either be === inputChracter,
    //a typo (different character or missed character),
    //or transposed with the next input
    Array.from(inputString).reduce((results, inputCharacter, index, array) => {
        //a transposition event generates two results, so if there is already an element at this index
        //this result is the transposition of the previous input character and we don't need to generate another result
        if (results[index]) return results;

        //if a random int is lower than the frequency setting, the resultCharacters is a typo
        if (getRandomInt() < settings.frequency) {
            //if a random int is lower than the transposition setting, then the typo is a transposition
            //this index will be the input character of the inputCharacter at inputString[index + 1]
            //results[index + 1] will be the inputCharacter from this index
            const nextInputCharacter = array[index + 1];

            if (
                getRandomInt() < settings.transposition &&
                nextInputCharacter !== inputCharacter
            ) {
                const result = {
                    inputCharacter,
                    resultCharacters: nextInputCharacter,
                };

                const nextResult = {
                    inputCharacter: nextInputCharacter,
                    resultCharacters: inputCharacter,
                };

                //push both result elements to the result array
                results.push(result);
                results.push(nextResult);
            } else {
                //resultCharacters are a typo
                //call the typo function to generate the typo
                const result = {
                    inputCharacter,
                    resultCharacters: typo({
                        character: inputCharacter,
                        keyboardModel,
                        settings,
                    }),
                };
                results.push(result);
            }
        } else {
            //if there's no typo, then the resultCharacters is the same as the inputCharacter
            results.push({ inputCharacter, resultCharacters: inputCharacter });
        }
        return results;
    }, []);

exports.getResults = getResults;
