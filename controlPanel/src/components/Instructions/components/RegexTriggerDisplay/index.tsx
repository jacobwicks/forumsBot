import React from 'react';
import ReactMarkdown from '../../../Markdown';
import useResize from '../../../APIs/components/Instructions/GenericInstructions/services/UseResize';
import { Segment, Header, Label } from 'semantic-ui-react';
import { Trigger } from '../../../../types/types';
import { spacing } from '../../../../services/Spacing';

export const RegexTriggerDisplay = ({
    input,
    triggers,
}: {
    input?: string;
    triggers: Trigger[];
}) => {
    const divRef = React.useRef<HTMLDivElement>(null);
    const maxWidth = useResize(divRef);

    return (
        <Segment>
            {!!input?.length ? (
                <div ref={divRef}>
                    <ReactMarkdown
                        key="markdown"
                        escapeHtml={false}
                        source={input}
                        maxWidth={maxWidth}
                    />{' '}
                </div>
            ) : (
                <>
                    <Header as="h4">
                        No example given to match regular expression trigger
                    </Header>
                    {triggers
                        .filter((trigger) => trigger instanceof RegExp)
                        .map((trigger, index) => (
                            <div key={index} style={spacing}>
                                <Label color="blue">RegExp</Label>{' '}
                                {trigger.toString()}
                            </div>
                        ))}
                </>
            )}
        </Segment>
    );
};

export default RegexTriggerDisplay;
