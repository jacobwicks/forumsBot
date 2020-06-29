import React, { useEffect, useState, useCallback, useContext } from 'react';
import { authFetchJSON } from '../../../../services/Api/services/AuthFetch';
import ReactMarkdown from '../../../Markdown';
import useResize from '../../../APIs/components/Instructions/GenericInstructions/services/UseResize';
import { ActionsContext } from '../../../../services/ActionsContext';
import { Segment, Header } from 'semantic-ui-react';

export const RegexTriggerDisplay = () => {
    const { action } = useContext(ActionsContext);
    const divRef = React.useRef<HTMLDivElement>(null);
    const maxWidth = useResize(divRef);
    const [input, setInput] = useState('');
    const [done, setDone] = useState<boolean | string>(false);

    const getInput = useCallback(async () => {
        if (!done || done !== action) {
            const route = `actionExample/${action}`;
            interface MarkdownResponse {
                markdown: string;
            }
            type MR = MarkdownResponse | undefined;

            const markdown = ((await authFetchJSON(route)) as MR)?.markdown;

            markdown ? setInput(markdown) : setInput('');

            setDone(action || 'placeholder');
        }
    }, [action, done, setDone, setInput]);

    useEffect(() => {
        getInput();
    }, [action, getInput]);

    const noExample = !!done && !input;

    return (
        <Segment>
            {noExample ? (
                <Header as="h4">
                    No example given to match regular expression trigger
                </Header>
            ) : (
                <div ref={divRef}>
                    <ReactMarkdown
                        key="markdown"
                        escapeHtml={false}
                        source={input}
                        maxWidth={maxWidth}
                    />{' '}
                </div>
            )}
        </Segment>
    );
};

export default RegexTriggerDisplay;
