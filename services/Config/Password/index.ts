import { getConfig } from '../index';

export const getPassword = async () => {
    const config = await getConfig();
    return config?.password;
};
