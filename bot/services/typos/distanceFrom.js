//accepts two indexes, returns a number and
//if returnPath === true, also an array of keys on the path from index1 to index2
//the first index is the target key
const distanceFrom = ({ index1, index2, keyboardModel, returnPath }) => {
    //keyboard is the array of arrays with elements containing upper and lowercase characters
    //the offsets are how far each row is shifted relative to others
    const { keyboard, offsets } = keyboardModel;

    let distance = 0;
    //if !!returnPath, make an array of each key on the path
    //the path is an array of the keys on the path from index1 to index2
    //not including index1, because index1 is the target key
    const keysOnPath = [keyboard[index2.row][index2.column]];

    //if they are the same key, return
    if (index1.row === index2.row && index1.column === index2.column)
        return returnPath
            ? {
                  distance,
                  path: [],
              }
            : distance;

    //the upper index is the character closer to the top left of the keyboard
    //if index 1 and 2 are on the same row,
    // upperIndex will be the character with the lower column
    const index1IsUpper =
        index1.row === index2.row
            ? index1.column < index2.column
            : //else, upperIndex will be the character with the lower row
              index1.row < index2.row;

    const upperIndex = index1IsUpper ? index1 : index2;

    const lowerIndex = index1IsUpper ? index2 : index1;

    //the column of the index closer to the bottom of the keyboard (higher row number)
    //is offset from the from the column of the index closer to the top (lower row number)
    //by offsets[higherRow] - offsets[lowerRow]
    let offset = offsets[lowerIndex.row] - offsets[upperIndex.row];

    //start the currentPosition at the lower index
    //we'll loop and move 1 key at a time until we reach the upperIndex
    let currentPosition = {
        row: lowerIndex.row,
        column: lowerIndex.column,
    };

    //use while loop to move from currentPosition to upperIndex
    while (
        currentPosition.row !== upperIndex.row ||
        currentPosition.column !== upperIndex.column
    ) {
        //rowDifference will always be 0 or positive number
        const rowDifference = !!(currentPosition.row - upperIndex.row);

        //columnDifference may be 0, or positive or negative
        const columnDifference = currentPosition.column - upperIndex.column;

        if (rowDifference && columnDifference) {
            //large offsets make diagonals more costly
            //if the offset is greater than 0.5 when making a diagonal move
            //distance increases by one
            //this lets you correctly model the distance between keys that are staggered on the keyboard
            if (offset > 0.5) {
                offset--;
                distance++;
            }

            //make a diagonal move by decrement row and adjust column + or - as needed
            //decrement row
            currentPosition.row--;
            //if columnDifference is positive, decrement. if negative, increment
            columnDifference > 0
                ? currentPosition.column--
                : currentPosition.column++;
        } else if (rowDifference && !columnDifference) {
            //rowDifference is the difference between the lowerIndex.row and upperIndex.row
            //because lowerIndex is by definition below the upperIndex or on the same row in the keyboard model
            //rowDifference will always be positive or 0, so only decrement
            currentPosition.row--;
        } else if (columnDifference && !rowDifference) {
            //columnDifference is the difference between the columns
            //it can be positive or negative or 0,
            //depending on if the lowerIndex column is to the left or right of the upperIndex column
            columnDifference > 0
                ? currentPosition.column--
                : currentPosition.column++;
        }
        //if currentPosition is not index1
        //add currentPosition to keysOnPath array
        if (
            currentPosition.row !== index1.row ||
            currentPosition.column !== index1.column
        ) {
            //we want the array keysOnPath to be in the order Closest to index1, furthest from index1
            //if index1 is the upper index
            //then we are approaching closer to index1 with each move => use Array.unshift
            //if index1 is the lower index
            //then we are moving further away from it with each move => use Array.push
            index1IsUpper
                ? keysOnPath.unshift(
                      keyboard[currentPosition.row][currentPosition.column]
                  )
                : keysOnPath.push(
                      keyboard[currentPosition.row][currentPosition.column]
                  );
        }

        //increment distance by 1
        distance++;
    }

    //if returnPath, then return the distance and the array of keys on the path
    return returnPath
        ? {
              distance,
              path: keysOnPath,
          }
        : //else just return distance
          distance;
};

exports.distanceFrom = distanceFrom;
