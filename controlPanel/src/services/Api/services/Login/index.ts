import { apiUrl } from '../../index';
import { LoginAction, LoginActionTypes } from '../../../../types/types';
import { saveToken } from '../Token';
import expectJSON from '../ExpectJSON';

interface TokenResponse {
    token: string;
}

const login = async ({
    dispatch,
    password,
}: {
    dispatch: React.Dispatch<LoginAction>;
    password: string;
}) => {
    dispatch({ type: LoginActionTypes.attempt });

    const route = 'login';
    const loginUrl = `${apiUrl}${route}`;

    const body = JSON.stringify({
        password,
    });

    const options = {
        //it's a post request
        method: 'POST',

        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },

        body,
    };

    try {
        //call fetch at the loginUrl
        const responsePromise = fetch(loginUrl, options);

        //response is either a json object or undefined
        const response = (await expectJSON(responsePromise)) as
            | TokenResponse
            | undefined;

        const token = response?.token;

        //if token is truthy
        //save the token to local storage
        token && saveToken(token)
            ? //and dispatch a success action
              dispatch({ type: LoginActionTypes.success })
            : //otherwise, login failed
              dispatch({ type: LoginActionTypes.failure });
    } catch (err) {
        //log(err)
        dispatch({ type: LoginActionTypes.failure });
    }
};

export default login;
