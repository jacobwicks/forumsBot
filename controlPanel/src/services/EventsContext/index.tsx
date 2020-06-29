import React, { createContext, useReducer } from 'react';
import { EventsState, EventsAction } from '../../types/types';

const initialState = {
    events: [],
    failed: false,
    listening: false,
    dispatch: (action: EventsAction) => undefined,
} as EventsState;

let reducer = (state: EventsState, action: EventsAction) => {
    switch (action.type) {
        case 'addEvent': {
            const { event } = action;
            const events = state.events.concat(event);
            return {
                ...state,
                events,
            };
        }
        case 'failed': {
            return {
                ...state,
                failed: true,
            };
        }
        case 'setListening': {
            const { listening } = action;
            return {
                ...state,
                listening,
            };
        }
        default: {
            console.log(`eventsContext default`, action);
            //throw new Error();
            return state;
        }
    }
};

const EventsContext = createContext(initialState);

const EventsProvider = (props: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    //add dispatch to value object and cast to EventsState
    const value = {
        ...state,
        dispatch,
    } as EventsState;

    return (
        <EventsContext.Provider value={value}>
            {props.children}
        </EventsContext.Provider>
    );
};

export { EventsContext, EventsProvider };
