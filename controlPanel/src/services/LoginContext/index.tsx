import React, { createContext, useReducer } from 'react';
import { LoginAction, LoginState } from '../../types/types';

const initialState = {
    isLoggedIn: false,
    loggingIn: false,
    modalOpen: false,
    dispatch: (action: LoginAction) => undefined,
} as LoginState;

let reducer = (state: LoginState, action: LoginAction) => {
    switch (action.type) {
        case 'attempt': {
            //const { password } = action;

            return {
                ...state,
                loggingIn: true,
                isLoggedIn: false,
            };
        }
        case 'failure': {
            return {
                ...state,
                loggingIn: false,
                isLoggedIn: false,
            };
        }
        case 'logout': {
            return {
                ...state,
                loggingIn: false,
                isLoggedIn: false,
                modalOpen: false,
            };
        }
        case 'openModal': {
            return {
                ...state,
                modalOpen: true,
            };
        }
        case 'success': {
            return {
                ...state,
                loggingIn: false,
                isLoggedIn: true,
                modalOpen: false,
            };
        }
        default: {
            console.log(`loginContext default`, action);
            //throw new Error();
            return state;
        }
    }
};

const LoginContext = createContext(initialState);
const LoginProvider = (props: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    //add dispatch to value object and cast to LoggedInState
    const value = {
        ...state,
        dispatch,
    } as LoginState;

    return (
        <LoginContext.Provider value={value}>
            {props.children}
        </LoginContext.Provider>
    );
};

export { LoginContext, LoginProvider };
