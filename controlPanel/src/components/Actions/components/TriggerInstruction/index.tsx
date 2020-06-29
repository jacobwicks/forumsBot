import React, { useContext } from 'react';
import { spacing } from '../../../../services/Spacing';
import { Segment, Header } from 'semantic-ui-react';
import { Trigger as TriggerType } from '../../../../types/types';
import { BotContext } from '../../../../services/BotContext';
import RegexTriggerDisplay from '../RegexTriggerDisplay';

const Trigger = ({ trigger }: { trigger: TriggerType }) => {
    const { settings } = useContext(BotContext);
    const botName = settings?.botName;
    return (
        <Segment>
            {botName} {trigger.toString()}
        </Segment>
    );
};

const TriggerInstruction = ({ triggers }: { triggers: TriggerType[] }) => {
    const hasRegExp = triggers.some((el) => el instanceof RegExp);

    return !!triggers.length ? (
        <Segment>
            <Header as="h2">How to trigger this action</Header>
            <div style={spacing}>
                {triggers.map(
                    (trigger, index) =>
                        !(trigger instanceof RegExp) && (
                            <Trigger key={index} trigger={trigger} />
                        )
                )}
            </div>
            {hasRegExp && <RegexTriggerDisplay />}
        </Segment>
    ) : (
        <Segment>
            <Header as="h2">No triggers set for this action</Header>
        </Segment>
    );
};

export default TriggerInstruction;
