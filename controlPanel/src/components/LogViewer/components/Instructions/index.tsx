import React from 'react';
import DisplayBox from '../DisplayBox';
import { Popup } from 'semantic-ui-react';
import User from '../../../User';
import { Instruction } from '../../../../types/types';
import Post from '../../../Post';

const Instructions = ({ instructions }: { instructions: Instruction[] }) => {
    if (instructions.length === 0) return <></>;
    const children = instructions.map((i) => {
        const { author, id, instruction, link } = i;
        return (
            <div>
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
                instructs bot "{instruction}" at{' '}
                <Popup
                    content={<Post post={i} />}
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
            </div>
        );
    });
    return <DisplayBox child={children} />;
};

export default Instructions;
