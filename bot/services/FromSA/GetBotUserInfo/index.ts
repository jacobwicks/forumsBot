import getUserInfo from '../GetUserInfo';
import { getCredsUserId } from '../../../../services/Config';
import getAndStoreNewCookies from '../GetAndStoreNewCookies';

export const getBotUserInfo = async () => {
    const userIdFromConfig = await getCredsUserId();

    if (userIdFromConfig) {
        return getUserInfo(userIdFromConfig);
    } else {
        // load it by logging in
        await getAndStoreNewCookies(true);
        const userId = await getCredsUserId();
        if (!userId) return undefined;

        return getUserInfo(userId);
    }
};

export default getBotUserInfo;
