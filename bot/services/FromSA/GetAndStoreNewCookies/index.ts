import getCookies from '../GetCookies';
import { KeyString } from '../../../../types';
import { setCookies } from '../../../../services/Config';

const getAndStoreNewCookies = async () => {
    const cookies = (await getCookies(true)) as KeyString;
    const stored = await setCookies(cookies);
    return stored;
};

export default getAndStoreNewCookies;
