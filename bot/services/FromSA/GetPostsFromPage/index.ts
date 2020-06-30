import { CheerioStatic2 } from '../CheerioLoad';
import { Post } from '../../../../types';
import getPostContent from '../GetPostContent';

//gets the posts from a searchable page
export const getPostsFromPage = async ($: CheerioStatic2): Promise<Post[]> => {
    const posts = ($('.post')
        .map((i: number, post: CheerioElement) => getPostContent({ $, post }))
        .toArray() as any) as Post[];

    return posts;
};

export default getPostsFromPage;
