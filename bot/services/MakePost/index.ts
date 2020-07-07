import fetch from 'node-fetch';
import cheerioLoad from '../FromSA/CheerioLoad';
import getHeaders from '../FromSA/GetHeaders';
import { getBody, getJustPosted } from './services/index';
import getReplyCookies from '../FromSA/GetReplyCookies';
import { newReply } from '../Urls';
import { sendLogEvent } from '../../../services/Events';
import logger from '../../../configs/Winston';
import {
    getSigShowText,
    getSigLinkInstructions,
    getSigText,
    getInstructionsHomepage,
    getBotName,
} from '../../../services/Config';

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
    let postContent = postId ? `${quote}${content}` : content;

    const sigSeparator = `
________________________________
`;
    const showText = await getSigShowText();
    const sigText = await getSigText();

    if (showText && sigText) {
        postContent += sigSeparator;
        postContent += sigText;
    }

    const linkInstructions = await getSigLinkInstructions();
    const instructionsUrl = await getInstructionsHomepage();

    if (linkInstructions && instructionsUrl) {
        !showText || !sigText
            ? (postContent += sigSeparator)
            : (postContent += '\n');

        const botName = await getBotName();
        postContent += `[url=${instructionsUrl}]How to use ${botName}[/url]`;
    }

    const headers = getHeaders(cookie);

    const url = newReply;

    const referrer = postId
        ? `${newReply}?action=newreply&postid=${postId}`
        : `${newReply}?action=newreply&threadid=${threadId}`;

    if (!threadId) {
        console.log(`can't make post, no threadId`);
        return;
    }

    const body = getBody({
        content: postContent,
        form_cookie,
        threadId,
    });
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
        const post = await getJustPosted({ cookie, threadId });

        logger.info(post);

        sendLogEvent({
            post,
        });
    } else {
        console.log(`didn't post!`, responseHTML);
    }
};

export default makePost;
