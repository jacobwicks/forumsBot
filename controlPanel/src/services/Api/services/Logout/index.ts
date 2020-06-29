import { LoginAction, LoginActionTypes } from '../../../../types/types';
import { deleteToken } from '../Token';

const logout = async (dispatch: React.Dispatch<LoginAction>) => {
    deleteToken();
    dispatch({ type: LoginActionTypes.logout });
};

export default logout;
