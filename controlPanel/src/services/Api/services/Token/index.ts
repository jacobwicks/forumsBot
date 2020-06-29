export const deleteToken = () => {
    try {
        localStorage.removeItem('token');
        return true;
    } catch (err) {
        console.error("couldn't delete login token", err);
        return false;
    }
};

export const getToken = () => localStorage.getItem('token');

export const saveToken = (token: any) => {
    if (!token) return undefined;
    try {
        localStorage.setItem('token', token);
        return true;
    } catch (err) {
        console.error("couldn't store login token", err);
        return false;
    }
};
