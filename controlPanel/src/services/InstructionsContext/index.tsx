import React, { createContext, useReducer } from 'react';
import { InstructionsState, InstructionsAction } from '../../types/types';

const initialState = {
    actions: [],
    albums: [],
    botName: '',
    done: false,
    fetching: false,
    failed: false,
    general: '',
    dispatch: (action: InstructionsAction) => undefined,
} as InstructionsState;

// }

let reducer = (state: InstructionsState, action: InstructionsAction) => {
    switch (action.type) {
        case 'done': {
            return {
                ...state,
                done: true,
                fetching: false,
            };
        }
        case 'failed': {
            return {
                ...state,
                actions: [],
                albums: [],
                done: true,
                fetching: false,
                failed: true,
                general: '',
            };
        }
        // setInstructions = 'setInstructions',
        case 'fetchAttempt': {
            return {
                ...state,
                fetching: true,
            };
        }
        case 'setBotName': {
            const { botName } = action;
            return {
                ...state,
                botName,
            };
        }
        case 'setInstructions': {
            const { instructions } = action;
            const { actions, albums, general } = instructions;
            return {
                ...state,
                failed: false,
                fetching: false,
                actions,
                albums,
                general,
            };
        }
        default: {
            console.log(`InstructionsContext default`, action);
            //throw new Error();
            return state;
        }
    }
};

const InstructionsContext = createContext(initialState);

//the Props that the InstructionsProvider will accept
type InstructionsProps = {
    //You can put react components inside of the Provider component
    children: React.ReactNode;

    //We might want to pass a state into the CardProvider for testing purposes
    testState?: InstructionsState;

    testDispatch?: (args: any) => void;
};

const InstructionsProvider = ({
    children,
    testState,
    testDispatch,
}: InstructionsProps) => {
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
    } as InstructionsState;

    return (
        <InstructionsContext.Provider value={value}>
            {children}
        </InstructionsContext.Provider>
    );
};

export { InstructionsContext, InstructionsProvider };
