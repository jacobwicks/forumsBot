//getKeysAround accepts a characterIndex and finds the keys at the given distance from the characterIndex
//we only use 1 or 2, but it'll work for any value
//distance has a default value of 1
const getKeysAround = ({ index, keyboard, offsets, distance = 1 }) => {
    if (!index || !keyboard) return undefined;

    const { row, column } = index;
    let keyIndexes = [];

    //    from the same row as the original character
    keyboard[row][column - distance] &&
        keyIndexes.push(keyboard[row][column - distance]);
    keyboard[row][column + distance] &&
        keyIndexes.push(keyboard[row][column + distance]);

    //we'll take a slice of the rows distance above and below the targetIndex.row
    //sliceLength is how many keys we're grabbing
    const sliceLength = distance * 2;

    //get the slice above
    //if the row at row-distance exists
    if (!!keyboard[row - distance]) {
        //reference to the row distance above the targetIndex
        const rowAbove = keyboard[row - distance];

        //calculate the offset
        const offsetAbove = Math.ceil(offsets[row] - offsets[row - distance]);

        //the end of the slice
        let end = Math.min(column + sliceLength, rowAbove.length);

        //this is an adjustment for the offsets on my keyboard
        //if you change the model, you'll probably have to change this line too
        row > 2 && column === 0 && (end = end - 1);

        const start = column - offsetAbove >= 0 ? column - offsetAbove : column;
        //get the slice from the row
        const slice = rowAbove.slice(start, end);

        //use Array.concat to add slice to the keyIndexes array
        keyIndexes = keyIndexes.concat(slice);
    }

    //        below
    if (keyboard[row + distance]) {
        const rowBelow = keyboard[row + distance];
        const offset = offsets[row + distance] - offsets[row];
        const start =
            Math.floor(column - offset) > -1 ? Math.floor(column - offset) : 0;
        let end = Math.ceil(
            Math.min(column + sliceLength - offset, rowBelow.length)
        );

        const slice = rowBelow.slice(start, end);
        keyIndexes = keyIndexes.concat(slice);
    }

    if (distance > 1) {
        for (let i = 1; i < distance; i++) {
            const indexAbove = row - i;
            const rowUp = keyboard[indexAbove];
            const offsetAbove = Math.ceil(offsets[row] - offsets[indexAbove]);
            if (rowUp) {
                if (indexAbove === 0) {
                    rowUp[column + distance + 1] &&
                        keyIndexes.push(rowUp[column + distance + 1]);
                    rowUp[column - distance + offsetAbove] &&
                        keyIndexes.push(rowUp[column - distance + offsetAbove]);
                } else {
                    rowUp[column + distance] &&
                        keyIndexes.push(rowUp[column + distance]);
                    rowUp[column - distance + offsetAbove] &&
                        keyIndexes.push(rowUp[column - distance + offsetAbove]);
                }
            }

            const indexDown = row + i;
            const rowDown = keyboard[indexDown];
            const offsetDown = Math.ceil(offsets[indexDown] - offsets[row]);

            if (rowDown) {
                rowDown[column + distance - offsetDown] &&
                    keyIndexes.push(rowDown[column + distance - offsetDown]);
                rowDown[column - distance] &&
                    keyIndexes.push(rowDown[column - distance]);
            }
        }
    }

    return keyIndexes;
};

exports.getKeysAround = getKeysAround;
