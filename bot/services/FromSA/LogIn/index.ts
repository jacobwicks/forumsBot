import checkCookies from '../CheckCookies';
import getAndStoreNewCookies from '../GetAndStoreNewCookies';

const login = async () => {
    const isLoggedIn = await checkCookies();
    if (!isLoggedIn) {
        await getAndStoreNewCookies();
    }
};

export default login;
