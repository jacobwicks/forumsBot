import React, { useState, useEffect } from 'react';

const AnimatedEllipse = () => {
    const [number, setNumber] = useState(3);

    let periods = '';
    for (let i = 0; i < number; i++) {
        periods += '.';
    }

    const timeout = setTimeout(() => {
        if (number > 2) {
            setNumber(0);
        } else {
            setNumber(number + 1);
        }
    }, 300);

    useEffect(() => {
        return () => clearTimeout(timeout);
    }, [timeout]);

    return <span>{periods}</span>;
};

export default AnimatedEllipse;
