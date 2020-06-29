import {
    ActionsAction,
    AlbumsAction,
    BotAction,
    ThreadsAction,
} from '../../../../types/types';
import { ActionArray } from '../../index';

//dispatches all actions
const dispatchAll = ({
    dispatch,
    actions,
}: {
    dispatch: (
        action: ActionsAction | AlbumsAction | BotAction | ThreadsAction
    ) => void;
    actions?: ActionArray;
}) => dispatch && actions && actions.forEach((action) => dispatch(action));

export default dispatchAll;
