import React, { ReactElement } from 'react';
import ImgurInstructions from './ImgurInstructions';
import TwitterInstructions from './TwitterInstructions';
import GenericInstructions from './GenericInstructions';

const Instructions = ({ api }: { api: string }) => {
    const instructions = {
        imgur: <ImgurInstructions api={api} />,
        twitter: <TwitterInstructions api={api} />,
        default: <GenericInstructions api={api} />,
    } as { [key: string]: ReactElement };

    return instructions[api.toLowerCase()]
        ? instructions[api.toLowerCase()]
        : instructions.default;
};

export default Instructions;
