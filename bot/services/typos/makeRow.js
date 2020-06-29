//makeRow accepts two strings and returns an array of objects with lower and upper properties
//we'll use it to make row arrays for our keyboard model
const makeRow = (rowLowercase, rowUppercase) =>
    Array.from(rowLowercase).map((lower, index) => ({
        //the lowercase character
        lower,
        //the uppercase character
        upper: rowUppercase.charAt(index),
    }));

exports.makeRow = makeRow;
