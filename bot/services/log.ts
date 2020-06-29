//this will point to an actuall logging utility
//if I ever care!
const log = (message: string, ...content: any) => {
    console.log(message, content ? content : 'no content attached');
};

export default log;
