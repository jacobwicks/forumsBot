import React from 'react';
import { Label } from 'semantic-ui-react';

const SideBarAction = ({
    labelColor,
    name,
    selectAction,
}: {
    labelColor?: 'green' | 'blue';
    name?: string;
    selectAction: () => void;
}) => (
    <div
        style={{
            cursor: 'pointer',
            padding: 10,
        }}
        onClick={selectAction}
    >
        {<Label color={labelColor}>{name}</Label>}
    </div>
);

export default SideBarAction;
