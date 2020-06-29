const { distanceFrom } = require('./distanceFrom.js');

//takes a character index and returns the distance from and index of
//the closest key in the homerowIndexes array
const getClosestHomeRow = (characterIndex, keyboardModel) =>
    keyboardModel.homeRowIndexes.slice(0).reduce(
        //by explicitly passing the array, we give ourselves the ability to break out of reduce
        //by calling .splice on it, thus mutating the input to the reduce function
        (closest, homeRow, i, array) => {
            //function to get distance of one key from another
            const currentDistance = distanceFrom({
                index1: characterIndex,
                index2: homeRow.index,
                keyboardModel,
            });

            if (
                closest.distance === undefined ||
                currentDistance < closest.distance
            ) {
                //found the closest so far, set the values of closest
                closest.distance = currentDistance;
                closest.index = homeRow.index;
            }

            //by splicing the array we can stop the reduce from looping
            if (closest.distance === 0) array.splice(1);

            return closest;
        },
        //the starting value of closest
        {
            distance: undefined,
            index: {
                row: undefined,
                column: undefined,
            },
        }
    );

exports.getClosestHomeRow = getClosestHomeRow;
