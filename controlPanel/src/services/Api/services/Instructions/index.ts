import { openFetchJSON } from '../OpenFetch';
import {
    ActionInstruction,
    AlbumInstruction,
    InstructionsAction,
    InstructionsActionTypes,
} from '../../../../types/types';
import { reviver } from '../../../JSONParseRegExReviver';

interface InstructionsResponse {
    actions: string;
    albums: AlbumInstruction[];
    general: string;
}

type IR = InstructionsResponse | undefined;

export const getInstructions = async (
    dispatch: React.Dispatch<InstructionsAction>
) => {
    dispatch({ type: InstructionsActionTypes.fetchAttempt });

    const route = 'instructions';
    const instructions = (await openFetchJSON(route)) as IR;

    const actions: ActionInstruction[] = instructions?.actions
        ? JSON.parse(instructions.actions, reviver)
        : [];

    const albums = instructions?.albums || [];

    const general = instructions?.general || '';

    dispatch({
        type: InstructionsActionTypes.setInstructions,
        instructions: {
            actions,
            albums,
            general,
        },
    });

    dispatch({ type: InstructionsActionTypes.done });
};
