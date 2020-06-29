//fetch that expects a JSON response
const expectJSON = async (responsePromise: Promise<Response | undefined>) => {
    if (!responsePromise) return undefined;
    const response = await responsePromise;
    try {
        const json: object | undefined = await response?.json();
        return json;
    } catch (err) {
        return undefined;
    }
};

export default expectJSON;
