export type Trigger = string | RegExp;

export interface DisplayAction {
    active: boolean;
    instructions?: string;
    name: string;
    triggers: Trigger[];
}

export enum ActionsActionTypes {
    currentAction = 'currentAction',
    fetchAttempt = 'fetchAttempt',
    failed = 'failed',
    setActions = 'setActions',
    setAction = 'setAction',
    setActive = 'setActive',
}

export type ActionsAction =
    //sets the current action that the user is viewing
    | { type: ActionsActionTypes.currentAction; key: string }

    //sets the entire actions object, retrieved from API
    | {
          type: ActionsActionTypes.setActions;
          actions: { [key: string]: DisplayAction };
      }
    //fetching failed
    | { type: ActionsActionTypes.failed }

    //currently fetching
    | { type: ActionsActionTypes.fetchAttempt }

    //set the value of an action
    | { type: ActionsActionTypes.setAction; key: string; value: DisplayAction }

    //set the active value of an action
    //refer to action as 'key'
    | { type: ActionsActionTypes.setActive; key: string; value: boolean };

//The Dispatch function
interface ActionsDispatch {
    dispatch: (action: ActionsAction) => void;
}

export interface ActionsType {
    action?: string;
    actions: { [key: string]: DisplayAction };
    fetching: boolean;
    failed: boolean;
}

//a union type. The Albums state will have a Stats object for any given key
//except dispatch will return the LoggedInDispatch function
export type ActionsState = ActionsType & ActionsDispatch;
