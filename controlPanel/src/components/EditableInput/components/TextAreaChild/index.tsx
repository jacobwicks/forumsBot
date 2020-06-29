import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';

interface ChildProps {
    handleBlur: (arg?: string | boolean) => void;
    setTemp: (arg?: string | boolean) => void;
    temp?: string | boolean;
}

const TextAreaChild = ({ handleBlur, temp, setTemp }: ChildProps) => (
    <Form>
        <TextArea
            onKeyPress={({ key }: { key: string }) => {
                if (key === 'Enter') handleBlur(temp);
            }}
            value={temp as string | undefined}
            onChange={(e, { value }) => setTemp(value ? value.toString() : '')}
            onBlur={(e: InputEvent) => {
                const target = e.target as HTMLInputElement;
                handleBlur(target.value);
            }}
        />
    </Form>
);

export default TextAreaChild;
