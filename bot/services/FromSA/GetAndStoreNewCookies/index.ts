import getCookies from '../GetCookies';
import { KeyString } from '../../../../types';
import { setCookies, setCredsUserId } from '../../../../services/Config';

interface CookiesResponse {
    cookies: KeyString;
    userId: number;
}

type CR = CookiesResponse | undefined;

const getAndStoreNewCookies = async (getUserId?: boolean) => {
    if (getUserId) {
        const response = (await getCookies({
            asObject: true,
            getUserId,
        })) as CR;
        const cookies = response?.cookies;
        const userId = response?.userId;

        const storedCookies = cookies && (await setCookies(cookies));
        const storedUserId = userId && (await setCredsUserId(userId));

        return storedCookies && storedUserId;
    } else {
        const cookies = (await getCookies({ asObject: true })) as KeyString;
        const stored = await setCookies(cookies);
        return stored;
    }
};

export default getAndStoreNewCookies;
