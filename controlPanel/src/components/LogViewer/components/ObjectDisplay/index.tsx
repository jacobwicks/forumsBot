import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import ArrayDisplay from '../ArrayDisplay';
import getChildren from '../GetChildren';

const ObjectDisplay = ({
    newest,
    object,
}: {
    newest: boolean;
    object: { [key: string]: any };
}) => {
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
                    {Object.keys(object).map((key: string) => {
                        const value = object[key];

                        //                        console.log(`key is ${key}, value is`, value, object);
                        const display =
                            // prettier-ignore
                            value === 'object' 
                            ? Array.isArray(value) 
                                ? <ArrayDisplay array={value} newest={newest} />
                                : getChildren(object, newest) 
                            : `${key}: ${value}`;

                        return <div key={key}>{display}</div>;
                    })}
                </div>
            )}
        </span>
    );
};

export default ObjectDisplay;
