import React, { useState } from 'react';
import { Button, Icon, Label, Segment } from 'semantic-ui-react';
import ArrayDisplay from '../ArrayDisplay';
import ApiInput from '../ApiInput';

const ObjectDisplay = ({
    api,
    keys,
    object,
    name,
}: {
    api: string;
    keys: string[];
    object: { [key: string]: any };
    name: string;
}) => {
    const [open, setOpen] = useState(false);
    const configKeys = [...keys, name];
    return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                <Button icon="edit" />
                <Label size="large">{name}</Label>
                <Icon name={open ? 'caret down' : 'caret right'} />
            </span>
            {open && (
                <Segment style={{ marginBottom: 10 }}>
                    {Object.keys(object).map((key: string) => {
                        const value = object[key];

                        //display it as an array, object, or string
                        const display =
                            // prettier-ignore
                            value === 'object' 
                            ? Array.isArray(value) 
                                ? <ArrayDisplay 
                                    api={api} 
                                    array={value} 
                                    keys={keys} 
                                    name={key}
                                    />
                                : <ObjectDisplay
                                    api={api}    
                                    object={value}
                                    name={key}
                                    keys={[...keys, key]}
                                />
                            :  <ApiInput
                                api={api}
                                keys={configKeys}
                                input={key}
                                value={value}
                                />;

                        return <div key={key}>{display}</div>;
                    })}
                </Segment>
            )}
        </div>
    );
};

export default ObjectDisplay;
