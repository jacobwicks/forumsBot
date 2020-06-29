import React from 'react';
import { Popup } from 'semantic-ui-react';
import User from '../../../User';
import Post from '../../../Post';
import { Post as SAPost } from '../../../../types/types';

const PostMadeByBot = ({ post }: { post: SAPost }) => {
    const { author } = post;
    const { link, id } = post;

    return (
        <>
            <Popup
                content={<User {...author} />}
                popperModifiers={{
                    preventOverflow: { boundariesElement: 'window' },
                }}
                position="top center"
                trigger={
                    <a
                        href={author.profile}
                        style={{ color: 'orange' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {author.name}
                    </a>
                }
            />{' '}
            made{' '}
            <Popup
                content={<Post post={post} />}
                popperModifiers={{
                    preventOverflow: { boundariesElement: 'window' },
                }}
                position="top center"
                trigger={
                    <a
                        href={link}
                        style={{ color: 'lightBlue' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        post #{id}
                    </a>
                }
            />
        </>
    );
};

export default PostMadeByBot;
