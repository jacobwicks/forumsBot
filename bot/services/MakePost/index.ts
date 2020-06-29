import fetch from 'node-fetch';
import cheerioLoad from '../FromSA/CheerioLoad';
import getHeaders from '../FromSA/GetHeaders';
import getSearchablePage from '../FromSA/GetSearchablePage';
import { getCredsUsername } from '../../../services/Config';
import { getBody } from './services/index';
import getReplyCookies from '../FromSA/GetReplyCookies';
import { newReply, showPost } from '../Urls';
import { sendLogEvent } from '../../../services/Events';

interface MakePostProps1 {
    content: string;
    postId: number;
    threadId: undefined;
}

interface MakePostProps2 {
    content: string;
    postId: undefined;
    threadId: number;
}

interface MakePostProps3 {
    content: string;
    postId: number;
    threadId: number;
}

type MakePostProps = MakePostProps1 | MakePostProps2 | MakePostProps3;

const makePost = async ({ content, threadId, postId }: MakePostProps) => {
    //reply cookies needs to give us threadId if we only have postId
    //we need the threadId in the body of the post submit
    const replyCookies = await getReplyCookies({ postId, threadId });
    const { cookie, form_cookie, quote } = replyCookies;

    //if we didn't get a threadId, we just got a postId
    //but the getReplyCookies function will supply us with the threadId
    !threadId && (threadId = replyCookies.threadId);

    //if we got a postId, we are quoting that post
    //add the quoted post into the postContent string
    const postContent = postId ? `${quote}${content}` : content;

    const username = await getCredsUsername();
    const headers = getHeaders(cookie);

    const url = newReply;

    const referrer = postId
        ? `${newReply}?action=newreply&postid=${postId}`
        : `${newReply}?action=newreply&threadid=${threadId}`;

    if (!threadId) {
        console.log(`can't make post, no threadId`);
        return;
    }

    const body = getBody({ content: postContent, form_cookie, threadId });
    console.log(`post content is`, postContent);

    const options = {
        headers,
        referrer,
        referrerPolicy: 'no-referrer-when-downgrade',
        body: body,
        method: 'POST',
        mode: 'cors',
    };

    const postResponse = await fetch(url, options);

    const responseHTML = await postResponse.text();
    // await fs.writeFile(
    //     `./responses/${new Date().getTime()}.html`,
    //     responseHTML,
    //     'utf8'
    // );

    const $ = cheerioLoad(responseHTML);

    //successful post page will have this element
    // <div align="center" style="font-size:24px;">
    // YOU JUST MADE A POST!<br>
    const posted = $.exists("div:contains('YOU JUST MADE A POST!')");

    if (posted) {
        //https://forums.somethingawful.com/showthread.php?threadid=3925033&goto=lastpost
        const url = `https://forums.somethingawful.com/showthread.php?threadid=${threadId}&goto=lastpost`;

        const $ = await getSearchablePage({
            cookie,
            url,
        });

        const authors = $('.author').filter(function () {
            //@ts-ignore
            return $(this).text().toLowerCase() === username.toLowerCase();
        });

        const author = authors[authors.length - 1];

        const post = $(author).closest('.post');

        const postId = Number(
            $(post).find('[title|="Link to this post"]').attr('href')?.slice(5)
        );

        const link = !isNaN(postId) ? showPost(postId) : postId;

        sendLogEvent({
            text: 'Made post',
            link,
        });
    } else {
        console.log(`didn't post!`, responseHTML);
    }
};

export default makePost;
