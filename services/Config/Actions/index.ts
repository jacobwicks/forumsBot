import { getConfig, writeToConfig } from '../index';
import { Trigger } from '../../../types';

export const getActions = async () => {
    const config = await getConfig();
    return config?.actions;
};

export const getAction = async (action: string) => {
    const actions = await getActions();
    return actions?.[action];
};

export const addActionIfNotExist = async ({
    key,
    triggers,
}: {
    key: string;
    triggers: Trigger[];
}) => {
    const exists = await getAction(key);

    const value = {
        active: true,
        triggers,
    };

    if (!exists) {
        console.log(`action ${key} does not exist, would write`, value);
        await writeToConfig({
            allowCreateKey: true,
            configKeys: ['actions', key],
            value,
        });
    }
};
