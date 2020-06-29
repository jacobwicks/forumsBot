import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import getChildren from '../GetChildren';

const ArrayDisplay = ({ array, newest }: { array: any[]; newest: boolean }) => {
    const [open, setOpen] = useState(false);

    return (
        <span>
            <Icon
                name={open ? 'caret down' : 'caret right'}
                onClick={() => setOpen(!open)}
                style={{ cursor: 'pointer' }}
            />
            {open && (
                <div
                    style={{
                        outline: 'solid',
                        outlineColor: 'lime',
                        margin: 10,
                    }}
                >
                    {array.map((el, key) =>
                        // prettier-ignore
                        React.isValidElement(el)
                        ? el
                         : typeof el === 'object'
                            ? Array.isArray(el) 
                                ? <ArrayDisplay array={el} newest={newest}/>
                                : getChildren(el, newest)
                            : <div key={key}>{el}</div>
                    )}
                </div>
            )}
        </span>
    );
};

export default ArrayDisplay;
