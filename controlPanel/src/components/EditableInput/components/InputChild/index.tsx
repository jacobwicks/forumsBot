import React from 'react';
import { Input } from 'semantic-ui-react';

interface InputChildProps {
    handleBlur: (arg?: string | boolean) => void;
    setTemp: (arg?: string | boolean) => void;
    temp?: string | boolean;
    password: boolean;
}

const InputChild = ({
    handleBlur,
    password,
    setTemp,
    temp,
}: InputChildProps) => (
    <Input
        onBlur={(e: InputEvent) => {
            const target = e.target as HTMLInputElement;
            handleBlur(target.value);
        }}
        onKeyPress={({ key }: { key: string }) => {
            if (key === 'Enter') handleBlur(temp);
        }}
        onChange={({ target }) => setTemp(target.value)}
        type={password ? 'password' : undefined}
        value={temp}
    />
);

export default InputChild;
