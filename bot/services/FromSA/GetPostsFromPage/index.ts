import { CheerioStatic2 } from '../CheerioLoad';
import { Post } from '../../../../types';

const baseUrl = 'https://forums.somethingawful.com/';

//ok, so, the smilies are stored in a lot of places
//I think most are in url type 1 or 2
//smiley url type 1  'https://fi.somethingawful.com/safs/smilies/1/8/same.001.gif'
//smiley url type 2  'https://fi.somethingawful.com/images/smilies/confused.gif';
//but then here's :whitewater:
//https://i.somethingawful.com/u/garbageday/2013/avatars/whitewater.gif
//maybe come back and figure all these out, but then again... maybe not
const smiley = 'https://fi.somethingawful.com/safs/smilies';
const smiley2 = 'https://fi.somethingawful.com/images/smilies';

const isSmiley = (img: string) =>
    img.slice(0, 42) === smiley || img.slice(0, 44) === smiley2;

//gets the posts from a searchable page
export const getPostsFromPage = async ($: CheerioStatic2): Promise<Post[]> => {
    const posts = ($('.post')
        .map((i: number, post: CheerioElement) => {
            const username = $(post).find('.author').text();

            const userId = Number(
                $(post)
                    .find('.userinfo')
                    .attr('class')
                    ?.split(' ')?.[1]
                    ?.slice(7)
            );

            const profile = `https://forums.somethingawful.com/member.php?action=getinfo&userid=${userId}`;

            const regDate = $(post).find('.registered').text();

            const avatar = $($(post).find('.title').find('img')[0]).attr('src');
            // const titleField = post.getElementsByClassName('title')[0];
            // //the avatar of the user that wrote the post
            // const avatar = titleField.querySelector('img')?.src;

            const title = $(post).find('.title').text()?.trim();

            const author = {
                avatar,
                id: userId,
                name: username,
                profile,
                regDate,
                title,
            };

            const date = new Date($(post).find('.postdate').text().trim());

            const body = $(post)
                .find('.postbody')
                .contents()
                .filter(function () {
                    //return only textnodes
                    //we only want waht the user posted, not quotes from other users
                    //or embeds or something
                    //@ts-ignore
                    return this.nodeType == 3;
                })
                .text()
                .trim();

            //get the first image, if any
            //use querySelectorAll to get all images
            const images = (($(post)
                .find('.postbody')
                .find('img')
                //cheerio map is different from javascript, index goes first
                .map((i, img) => $(img).attr('src'))
                //typescript doesn't recognize the type of img element
                //nor that toArray returns whetever you put in the array instead of CheerioElement
                .toArray() as any) as string[])
                //filter out the smileys
                .filter((img) => !isSmiley(img));

            //the first image in a post
            const image = images[0];

            //the postId
            const id = Number($(post).attr('id')?.slice(4));

            //use the querySelector
            //find the link to post element on each post
            //and, if it exists, return the link href
            const link = `${$.currentUrl}${$(post)
                .find('[title="Link to this post"]')
                .attr('href')}`;

            return {
                author,
                body,
                date,
                id,
                image,
                images,
                link,
            };
        })
        .toArray() as any) as Post[];

    return posts;
};

export default getPostsFromPage;
