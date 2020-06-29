//a placeholder for actual logging
const log = (message: string, ...content: any) => {
    console.log(message, content ? content : 'no content attached');
};
export default log;
