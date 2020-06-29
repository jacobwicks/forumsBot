import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import AddTriggerButton from '../AddTriggerButton';
import TriggerInput from '../../../TriggerInput';
import { spacing } from '../../../../../../services/Spacing';
import { Trigger } from '../../../../../../types/types';

const Triggers = ({
    action,
    triggers,
}: {
    action: string;
    triggers: Trigger[];
}) => (
    <Segment>
        <Header as="h2">Triggers</Header>
        <AddTriggerButton />
        <div style={spacing}>
            {triggers.map((trigger, index) => (
                <TriggerInput
                    key={`${index}${action}`}
                    index={index}
                    trigger={trigger}
                />
            ))}
        </div>
    </Segment>
);

export default Triggers;
