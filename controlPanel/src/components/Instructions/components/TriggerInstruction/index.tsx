import React, { useContext } from 'react';
import { spacing } from '../../../../services/Spacing';
import { Segment, Header } from 'semantic-ui-react';
import { Trigger as TriggerType } from '../../../../types/types';
import RegexTriggerDisplay from '../RegexTriggerDisplay';
import { InstructionsContext } from '../../../../services/InstructionsContext';

const Trigger = ({ trigger }: { trigger: TriggerType }) => {
    const { botName } = useContext(InstructionsContext);
    return (
        <Segment>
            {botName} {trigger.toString()}
        </Segment>
    );
};

const TriggerInstruction = ({
    example,
    triggers,
}: {
    example?: string;
    triggers: TriggerType[];
}) => {
    const hasRegExp = triggers.some((el) => el instanceof RegExp);

    return !!triggers.length ? (
        <Segment>
            <Header as="h3">How to trigger this action</Header>
            <div style={spacing}>
                {triggers.map(
                    (trigger, index) =>
                        !(trigger instanceof RegExp) && (
                            <Trigger key={index} trigger={trigger} />
                        )
                )}
            </div>
            {hasRegExp && (
                <RegexTriggerDisplay input={example} triggers={triggers} />
            )}
        </Segment>
    ) : (
        <Segment>
            <Header as="h2">No triggers set for this action</Header>
        </Segment>
    );
};

export default TriggerInstruction;
