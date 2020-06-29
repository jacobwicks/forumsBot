const { getRandomInt } = require('./getRandomInt.js');

//returns a random integer betweeen/including min and max
//weighted toward returning min
//the higher the value of severity, the more likely to return max
const severityWeightedRandomInt = (min, max, severity) => {
    //increment min and max for rounded calculation
    min++;
    max++;

    //this generates a number that is weighted toward the min value
    //max divided by a random percentage of max plus min
    const rounded = Math.round(max / (Math.random() * max + min)) - 1;

    //value of severity may be 1-4
    //if severity is greater than a random int,
    if (getRandomInt(1, 3) < severity) {
        //decrement max back down to provided value
        max--;
        //add a random int up to the value of severity to the result
        const result = rounded + getRandomInt(0, severity);

        //if result is greater than max, return max
        return result > max ? max : result;
    } else return rounded;
};

exports.severityWeightedRandomInt = severityWeightedRandomInt;
