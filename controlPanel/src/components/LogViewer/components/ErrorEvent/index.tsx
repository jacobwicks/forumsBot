import React, { useState } from 'react';

const ErrorEvent = ({ error, newest }: { error: string; newest: boolean }) => {
    const [visible, setVisible] = useState(true);

    newest &&
        setTimeout(() => {
            setVisible(!visible);
        }, 300);

    return (
        <span style={{ color: 'red' }}>
            {!newest || visible ? (
                <span>ERROR </span>
            ) : (
                <span style={{ color: 'black' }}>ERROR </span>
            )}
            {error}
        </span>
    );
};

export default ErrorEvent;
