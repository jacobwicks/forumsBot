const { getRandomInt } = require('./getRandomInt.js');
const { severityWeightedRandomInt } = require('./severityWeightedRandomInt.js');

//needs settings, path, keyswithin1, keyswithin2, desiredcase
const getMistakeCharacter = ({
    //will return an upper or lower case character as desired
    desiredCase,
    //errors
    typos,
    //the error settings the user has chosen
    settings,
}) => {
    //get the arrays of possible typos
    const { path, keysWithin1, keysWithin2 } = typos;

    const { severity } = settings;
    //the rollTable defines the chances of selecting from the arrays
    //given the value of settings.severity
    //as severity gets larger, you become more likely to generate from the keysWithin2 array
    //when you exceed the keysWithin1 value
    const rollTable = {
        path: {
            1: 90,
            2: 75,
            3: 55,
            4: 35,
        },
        keysWithin1: {
            1: 100,
            2: 99,
            3: 90,
            4: 70,
        },
    };

    //roll is 1-100
    const roll = getRandomInt();

    if (roll < rollTable.path[severity]) {
        //75% chance key on path
        //if path.length = 0, choose from keyswithin1 instead
        return !!path.length
            ? path[severityWeightedRandomInt(0, path.length - 1, severity)][
                  desiredCase
              ]
            : keysWithin1[
                  severityWeightedRandomInt(0, keysWithin1.length - 1, severity)
              ][desiredCase];
    } else if (roll < rollTable.keysWithin1[severity]) {
        //return a key within 1 of the target key
        return keysWithin1[
            severityWeightedRandomInt(0, keysWithin1.length - 1, severity)
        ][desiredCase];
    } else {
        //return a key within 2 of the target key
        //use unweighted random, they are all dire
        return keysWithin2[getRandomInt(0, keysWithin2.length - 1)][
            desiredCase
        ];
    }
};

exports.getMistakeCharacter = getMistakeCharacter;
