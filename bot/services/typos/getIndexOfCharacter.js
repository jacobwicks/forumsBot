//getIndexOfCharacter accepts a letter and finds it in the keyboard
//it will return an object with row, column, and isUppercase boolean
//if the character is not found, it will return undefined
const getIndexOfCharacter = (character, keyboard) => {
    //if there's no keyboard or no character, we're not going to find an index
    if (!keyboard || !character) return undefined;

    let returnIndex;

    //loop through each row
    for (let row = 0; row < keyboard.length; row++) {
        //the Array.findIndex method used below just returns a number, not an object
        //so create a variable to track if the character is uppercase out here
        let isUppercase = false;

        //pass a callback function to Array.findIndex
        //to examine each element in the array and return the index of the element that returns true
        const column = keyboard[row].findIndex((characters) => {
            //if the character is not a space, and matches the upper case
            if (character !== ' ' && characters.upper === character) {
                //it's uppercase
                isUppercase = true;
            }

            //findIndex will return the index when this expression is true
            return (
                characters.upper === character || characters.lower === character
            );
        });

        //if no match is found, column will be -1
        //so if column > -1, a match has been found
        if (column > -1) {
            //set the values in returnIndex
            returnIndex = {
                row,
                column,
                isUppercase,
            };
            //and return it
            return returnIndex;
        }
    }

    return returnIndex;
};

exports.getIndexOfCharacter = getIndexOfCharacter;
