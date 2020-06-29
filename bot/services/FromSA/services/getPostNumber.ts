//the forums use anchor links to link to individual posts
//the url will resolve to something with the post number on the page
//https://forums.somethingawful.com/showthread.php?noseen=0&threadid=3921885&perpage=40&pagenumber=109#pti34
const getPostNumber = (url: string) => {
    const params = new URLSearchParams(url);
    const anchor = params.get('pagenumber')?.split('#').pop();

    //lastpost indicates that we have already read all the posts in the thread
    //no anchor indicates that we haven't read any posts in the thread
    //either way, the calling function should deal with them
    if (!anchor || anchor === 'lastpost') {
        return anchor;
    } else {
        //anchor starts with 'pti', slice that off
        //convert the string to a number
        //subtract 1 for a 0 based index
        const postNumber = Number(anchor.slice(3)) - 1;

        //don't want to deal with NaN in calling function
        return postNumber === NaN ? undefined : postNumber;
    }
};

export default getPostNumber;
