const { makeRow } = require('./makeRow.js');

//to model a keyboard
//make an array of arrays
const getKeyboard = () => {
    //string for the lowercase characters in row0
    const row0Lower = '`1234567890-=';
    //string for the uppercase characters in row0
    const row0Upper = '~!@#$%^&*()_+';

    const row1Lower = 'qwertyuiop[]';
    const row1Upper = 'QWERTYUIOP{}|';

    //double quotes because the single quote is in this row
    const row2Lower = "asdfghjkl;'";
    const row2Upper = 'ASDFGHJKL:"';

    const row3Lower = 'zxcvbnm,./';
    const row3Upper = 'ZXCVBNM<>?';

    //the spacebar is 5 keys long
    const row4 = Array.from('     ').map((space) => ({
        upper: space,
        lower: space,
    }));

    //and here's the whole keyboard
    return [
        makeRow(row0Lower, row0Upper),
        makeRow(row1Lower, row1Upper),
        makeRow(row2Lower, row2Upper),
        makeRow(row3Lower, row3Upper),
        row4,
    ];
};

exports.getKeyboard = getKeyboard;
