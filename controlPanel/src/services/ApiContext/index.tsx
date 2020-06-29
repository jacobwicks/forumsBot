import React, { createContext, useReducer } from 'react';
import { ApiAction, ApiState } from '../../types/types';

const initialState = {
    apis: {},
    current: '',
    fetching: [],
    failed: [],
    dispatch: (action: ApiAction) => undefined,
} as ApiState;

let reducer = (state: ApiState, action: ApiAction) => {
    switch (action.type) {
        case 'failed': {
            const { api } = action;

            const failed = state.failed.includes(api)
                ? state.failed
                : [...state.failed, api];

            const fetching = state.fetching.filter((f) => f !== api);

            return {
                ...state,
                failed,
                fetching,
            };
        }
        case 'fetching': {
            const { api } = action;

            const fetching = state.fetching.includes(api)
                ? state.fetching
                : [...state.fetching, api];

            return {
                ...state,
                fetching,
            };
        }
        case 'setApis': {
            const { apis } = action;
            const fetching = state.fetching.filter((f) => f !== 'apis');
            return {
                ...state,
                apis,
                fetching,
            };
        }
        case 'setApi': {
            const { api, value } = action;
            const apis = { ...state.apis, [api]: value };
            const fetching = state.fetching.filter((f) => f !== api);
            return {
                ...state,
                apis,
                fetching,
            };
        }
        case 'setCurrent': {
            const { current } = action;
            return {
                ...state,
                current,
            };
        }
        default: {
            console.log(`apiContext default`, action);
            //throw new Error();
            return state;
        }
    }
};

const ApiContext = createContext(initialState);

//the Props that the CardProvider will accept
type ApiProps = {
    //You can put react components inside of the Provider component
    children: React.ReactNode;

    //We might want to pass a state into the CardProvider for testing purposes
    testState?: ApiState;

    testDispatch?: (args: any) => void;
};

const ApiProvider = ({ children, testState, testDispatch }: ApiProps) => {
    //useReducer returns an array containing the state at [0]
    //and the dispatch method at [1]
    //use array destructuring to get state and dispatch
    const [state, dispatch] = useReducer(
        reducer,
        testState ? testState : initialState
    );

    //add dispatch to value object and cast to ApiState
    const value = {
        ...state,
        dispatch,
    } as ApiState;

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export { ApiContext, ApiProvider };
