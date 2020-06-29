import { Trigger } from '../types';

export interface ActionInstruction {
    example?: string;
    instructions?: string;
    key: string;
    name: string;
    triggers: Trigger[];
}

export interface AlbumInstruction {
    album: string;
    description?: string;
}

export enum InstructionsActionTypes {
    done = 'done',
    failed = 'failed',
    fetchAttempt = 'fetchAttempt',
    setBotName = 'setBotName',
    setInstructions = 'setInstructions',
}

export type InstructionsAction =
    //fetching done
    | { type: InstructionsActionTypes.done }

    //fetching failed
    | { type: InstructionsActionTypes.failed }

    //currently fetching
    | { type: InstructionsActionTypes.fetchAttempt }

    //set the botName
    | { type: InstructionsActionTypes.setBotName; botName: string }

    //set the instruction state, except for botName
    | {
          type: InstructionsActionTypes.setInstructions;
          instructions: {
              actions: ActionInstruction[];
              albums: AlbumInstruction[];
              general: string;
          };
      };

//The Dispatch function
interface InstructionsDispatch {
    dispatch: (action: InstructionsAction) => void;
}

export interface InstructionsType {
    actions: ActionInstruction[];
    albums: AlbumInstruction[];
    botName: string;
    done: boolean;
    fetching: boolean;
    failed: boolean;
    general: string;
}

//a union type
export type InstructionsState = InstructionsType & InstructionsDispatch;
