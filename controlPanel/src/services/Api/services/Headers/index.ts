import { getToken } from '../Token';

export const getHeaders = () => {
    const token = getToken();
    return token
        ? new Headers({
              Accept: 'application/json',
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
          })
        : undefined;
};
