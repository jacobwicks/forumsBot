import getSearchablePage from '../GetSearchablePage';

const getQuotedPostContent = async ({
    cookie,
    postId,
}: {
    cookie: string;
    postId: number;
}) => {
    const url = `https://forums.somethingawful.com/newreply.php?action=newreply&postid=${postId}`;

    const $ = await getSearchablePage({ cookie, url });

    const content = $('textarea').first()?.val();

    return content;
};

export default getQuotedPostContent;
