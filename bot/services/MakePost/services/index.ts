import { newReply, threadLastPost } from '../../Urls/';
import getSearchablePage from '../../FromSA/GetSearchablePage';
import getPostContent from '../../FromSA/GetPostContent';
import { getCredsUsername } from '../../../../services/Config';

export const getBody = ({
    content,
    form_cookie,
    threadId,
}: {
    content: string;
    form_cookie: string;
    threadId: number;
}) =>
    `------WebKitFormBoundarymlWyzjkCzuiG6pou\r\nContent-Disposition: form-data; name="action"\r\n\r\npostreply\r\n------WebKitFormBoundarymlWyzjkCzuiG6pou\r\nContent-Disposition: form-data; name="threadid"\r\n\r\n${threadId}\r\n------WebKitFormBoundarymlWyzjkCzuiG6pou\r\nContent-Disposition: form-data; name="formkey"\r\n\r\ncff283f0fe6eaa281df990682ad7f90a\r\n------WebKitFormBoundarymlWyzjkCzuiG6pou\r\nContent-Disposition: form-data; name="form_cookie"\r\n\r\n${form_cookie}\r\n------WebKitFormBoundarymlWyzjkCzuiG6pou\r\nContent-Disposition: form-data; name="message"\r\n\r\n${content}\r\n------WebKitFormBoundarymlWyzjkCzuiG6pou\r\nContent-Disposition: form-data; name="parseurl"\r\n\r\nyes\r\n------WebKitFormBoundarymlWyzjkCzuiG6pou\r\nContent-Disposition: form-data; name="submit"\r\n\r\nSubmit Reply\r\n------WebKitFormBoundarymlWyzjkCzuiG6pou--\r\n`;
//"------WebKitFormBoundaryABhAS8XRlpNYvAbD\r\nContent-Disposition: form-data; name=\"action\"\r\n\r\npostreply\r\n------WebKitFormBoundaryABhAS8XRlpNYvAbD\r\nContent-Disposition: form-data; name=\"threadid\"\r\n\r\n3749739\r\n------WebKitFormBoundaryABhAS8XRlpNYvAbD\r\nContent-Disposition: form-data; name=\"formkey\"\r\n\r\na65eb016e5c971e104785cb2eb8ddd71\r\n------WebKitFormBoundaryABhAS8XRlpNYvAbD\r\nContent-Disposition: form-data; name=\"form_cookie\"\r\n\r\n1822ac3a8d6e\r\n------WebKitFormBoundaryABhAS8XRlpNYvAbD\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n[quote=\"torgeaux\" post=\"505548059\"]\r\nRemember, the cast iron will expand when heated, so it's really going to be more like 10.04 inches.\r\n[/quote]\r\n\r\n:hmmyes:\r\n------WebKitFormBoundaryABhAS8XRlpNYvAbD\r\nContent-Disposition: form-data; name=\"parseurl\"\r\n\r\nyes\r\n------WebKitFormBoundaryABhAS8XRlpNYvAbD\r\nContent-Disposition: form-data; name=\"bookmark\"\r\n\r\nyes\r\n------WebKitFormBoundaryABhAS8XRlpNYvAbD\r\nContent-Disposition: form-data; name=\"submit\"\r\n\r\nSubmit Reply\r\n------WebKitFormBoundaryABhAS8XRlpNYvAbD--\r\n",

export const getPostReferrer = (postId: number) =>
    `${newReply}?action=newreply&postid=${postId}`;

export const getJustPosted = async ({
    cookie,
    threadId,
}: {
    cookie: string;
    threadId: number;
}) => {
    //https://forums.somethingawful.com/showthread.php?threadid=3925033&goto=lastpost
    const url = threadLastPost(threadId);

    const $ = await getSearchablePage({
        cookie,
        url,
    });

    const username = await getCredsUsername();

    const authors = $('.author').filter(function () {
        //there is probably some way to do this with an arrow function and no 'this'
        //but it works, so here we are
        //@ts-ignore
        return $(this).text().toLowerCase() === username.toLowerCase();
    });

    const author = authors[authors.length - 1];

    //convert it toArray to get CheerioElement type instead of Cheerio
    const asArray = $(author).closest('.post').toArray();

    const targetPost = asArray?.[0];

    // const postId = Number(
    //     $(targetPost)
    //         .find('[title|="Link to this post"]')
    //         .attr('href')
    //         ?.slice(5)
    // );

    const post = getPostContent({ $, post: targetPost });

    return post;
};
