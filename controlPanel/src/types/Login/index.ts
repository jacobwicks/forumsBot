//the types of action that the reducer in BotContext will handle
export enum LoginActionTypes {
    attempt = 'attempt',
    failure = 'failure',
    logout = 'logout',
    openModal = 'openModal',
    success = 'success',
}

export type LoginAction =
    //attempting to login, waiting for response
    | { type: LoginActionTypes.attempt }

    //login attempt failed
    | { type: LoginActionTypes.failure }

    //user logs out
    | { type: LoginActionTypes.logout }

    //the login modal is open or not
    | { type: LoginActionTypes.openModal }

    //login attempt succeeded
    //token has been stored in localStorage
    | { type: LoginActionTypes.success };

//The Dispatch function
interface LoginDispatch {
    dispatch: React.Dispatch<LoginAction>;
}

interface LoginType {
    isLoggedIn: boolean;
    loggingIn: boolean;
    modalOpen: boolean;
}
//a union type. The LoggedIn state will have a Stats object for any given key
//except dispatch will return the LoggedInDispatch function
export type LoginState = LoginType & LoginDispatch;
