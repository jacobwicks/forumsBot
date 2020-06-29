//takes an array of input and result characters
//returns a string made from the resultcharacters
const resultArrayToString = (resultArray) =>
    resultArray.reduce((outputString, { resultCharacters }) => {
        //if there are result characters, add them to the outputstring
        !!resultCharacters && (outputString += resultCharacters);

        return outputString;
    }, '');

exports.resultArrayToString = resultArrayToString;
