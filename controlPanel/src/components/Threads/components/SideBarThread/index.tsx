import React from 'react';
import { Label, Popup } from 'semantic-ui-react';

const SideBarThread = ({
    bookmarked,
    labelColor,
    name,
    selectThread,
    title,
    unreadPosts,
}: {
    bookmarked: boolean;
    labelColor?: 'green' | 'blue';
    name?: string;
    selectThread: () => void;
    title?: string;
    unreadPosts?: number;
}) => (
    <div
        style={{
            cursor: 'pointer',
            padding: 10,
        }}
        onClick={selectThread}
    >
        <Popup
            disabled={!name}
            content={title}
            trigger={<Label color={labelColor}>{name ? name : title}</Label>}
        />
        {bookmarked && (
            <Label
                color={unreadPosts ? 'blue' : undefined}
                content={unreadPosts}
            />
        )}
    </div>
);

export default SideBarThread;
