export enum EventsActionTypes {
    addEvent = 'addEvent',
    failed = 'failed',
    setListening = 'setListening',
}

export type EventsAction =
    //received event from event source. add it to array of LogEvents
    | {
          type: EventsActionTypes.addEvent;
          event: LogEvent | LogEvent[];
      }

    //failed to get event source
    | { type: EventsActionTypes.failed }

    //already listening to event source
    | { type: EventsActionTypes.setListening; listening: boolean };

export interface EventsDispatch {
    dispatch: React.Dispatch<EventsAction>;
}

interface EventsType {
    events: LogEvent[];
    failed: boolean;
    listening: boolean;
}

export type EventsState = EventsType & EventsDispatch;

export type LogEvent = {
    time: string;
    text?: string;
    data?: object;
};

//the types of log events
export enum LogEventTypes {
    apiMessage = 'apiMessage',
    array = 'array',
    botStatus = 'botStatus',
    error = 'error',
    instructions = 'instructions',
    timeLeft = 'timeLeft',
    link = 'link',
    post = 'post',
    setting = 'setting',
    threads = 'threads',
    text = 'text',
}
