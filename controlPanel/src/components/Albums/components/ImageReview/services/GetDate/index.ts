export const getDate = (submittedDate: string) => {
    submittedDate = new Date(submittedDate).toString();

    //get the date
    submittedDate = submittedDate.slice(0, submittedDate.length - 36);

    //the minutes
    const minutes = submittedDate.slice(-3);

    let hours = submittedDate.slice(-5, -3);

    //set am or pm
    const amPm = Number(hours) > 11 ? 'PM' : 'AM';

    //set hours
    if (Number(hours) > 12) hours = (Number(hours) - 12).toString();
    if (Number(hours) === 0) hours = '12';

    //set the date
    const date = submittedDate.slice(0, submittedDate.length - 5);

    return `${date} ${hours} ${minutes} ${amPm}`;
};
