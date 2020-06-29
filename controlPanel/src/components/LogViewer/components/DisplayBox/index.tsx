import React, { ReactElement, useState } from 'react';
import { Icon } from 'semantic-ui-react';

const DisplayBox = ({ child }: { child: ReactElement | ReactElement[] }) => {
    const [open, setOpen] = useState(false);

    return (
        <span>
            <Icon
                name={open ? 'caret down' : 'caret right'}
                onClick={() => setOpen(!open)}
            />
            {open && (
                <div
                    style={{
                        outline: 'solid',
                        outlineColor: 'lime',
                        margin: 10,
                    }}
                >
                    {child}
                </div>
            )}
        </span>
    );
};

export default DisplayBox;
