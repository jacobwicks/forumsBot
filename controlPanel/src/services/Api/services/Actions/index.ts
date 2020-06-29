import deleteTrigger from './DeleteTrigger';
import convertTrigger from './ConvertTrigger';
import setTriggerValue from './SetTriggerValue';

export const getTriggerConfigKeys = ({
    action,
    index,
}: {
    action: string;
    index?: number;
}) =>
    index === undefined
        ? ['actions', action, 'triggers']
        : ['actions', action, 'triggers', index.toString()];

export { convertTrigger, deleteTrigger, setTriggerValue };
