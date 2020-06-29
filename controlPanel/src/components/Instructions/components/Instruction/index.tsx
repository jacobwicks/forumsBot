import React, { useState } from 'react';
import { Segment, Header } from 'semantic-ui-react';
import ReactMarkdown from '../../../Markdown';
import useResize from '../../../APIs/components/Instructions/GenericInstructions/services/UseResize';
import { spacing } from '../../../../services/Spacing';

export const Instruction = ({
    input,
    name,
    addChildren,
    forceOpen,
}: {
    forceOpen?: boolean;
    input: string;
    name: string;
    addChildren?: JSX.Element[];
}) => {
    const [open, setOpen] = useState(!!forceOpen);
    const divRef = React.useRef<HTMLDivElement>(null);
    const maxWidth = useResize(divRef);

    const markdownChild = (
        <div onClick={(e) => !forceOpen && setOpen(false)}>
            <ReactMarkdown
                key="markdown"
                escapeHtml={false}
                source={input}
                maxWidth={maxWidth}
            />
        </div>
    );

    const inputName = input.split(/\r?\n/)[0].replace('#', '').trim();

    const child = (
        <div
            onClick={(e) => {
                e.preventDefault();
                setOpen(true);
            }}
        >
            <Header as="h3">{inputName ? inputName : name}</Header>
        </div>
    );

    const children = [open ? markdownChild : child];

    if (open) {
        addChildren?.forEach((child, index) =>
            children.push({ ...child, key: index.toString() })
        );
    }

    const style = forceOpen ? spacing : { ...spacing, cursor: 'pointer' };
    return (
        <div ref={divRef} style={style}>
            <Segment children={children} />
        </div>
    );
};

export default Instruction;
