import React from 'react';
import { Segment, Image } from 'semantic-ui-react';
import { Post as PostInterface } from '../../types/types';

const Post = ({ post }: { post: PostInterface }) => {
    const { body, image } = post;

    return (
        <Segment>
            {image && <Image size="small" src={image} />}
            {body}
        </Segment>
    );
};

export default Post;
