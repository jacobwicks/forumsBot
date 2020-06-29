import React, { createContext, useReducer } from 'react';
import { ActionsState, ActionsAction } from '../../types/types';

const initialState = {
    actions: {},
    failed: false,
    fetching: false,
    dispatch: (action: ActionsAction) => undefined,
} as ActionsState;

let reducer = (state: ActionsState, action: ActionsAction) => {
    switch (action.type) {
        case 'currentAction': {
            const { key } = action;
            return {
                ...state,
                action: key,
            };
        }
        case 'failed': {
            return {
                ...state,
                failed: true,
                fetching: false,
                actions: {},
            };
        }
        case 'fetchAttempt': {
            return {
                ...state,
                fetching: true,
            };
        }
        case 'setAction': {
            const { key, value } = action;
            const newActions = { ...state.actions };
            newActions[key] = value;
            return {
                ...state,
                actions: newActions,
            };
        }
        case 'setActions': {
            const { actions } = action;
            return {
                ...state,
                failed: false,
                fetching: false,
                actions,
            };
        }
        case 'setActive': {
            const { key, value } = action;
            const newActions = { ...state.actions };
            const newAction = { ...newActions[key] };
            newAction.active = value;

            newActions[key] = newAction;

            return {
                ...state,
                actions: newActions,
            };
        }
        default: {
            console.log(`actionsContext default`, action);
            //throw new Error();
            return state;
        }
    }
};

const ActionsContext = createContext(initialState);

//the Props that the ActionsProvider will accept
type ActionsProps = {
    //You can put react components inside of the Provider component
    children: React.ReactNode;

    //We might want to pass a state into the CardProvider for testing purposes
    testState?: ActionsState;

    testDispatch?: (args: any) => void;
};

const ActionsProvider = ({
    children,
    testState,
    testDispatch,
}: ActionsProps) => {
    //useReducer returns an array containing the state at [0]
    //and the dispatch method at [1]
    //use array destructuring to get state and dispatch
    const [state, dispatch] = useReducer(
        reducer,
        testState ? testState : initialState
    );

    //add dispatch to value object and cast to LoggedInState
    const value = {
        ...state,
        dispatch,
    } as ActionsState;

    return (
        <ActionsContext.Provider value={value}>
            {children}
        </ActionsContext.Provider>
    );
};

export { ActionsContext, ActionsProvider };
