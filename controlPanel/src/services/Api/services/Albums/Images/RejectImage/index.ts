import authFetch from '../../../AuthFetch';
import { AlbumsAction, AlbumsActionTypes } from '../../../../../../types/types';
import { Dispatch } from 'react';

const rejectImageAPI = async (submittedAt: string) => {
    const route = 'rejectImage';

    try {
        const response = await authFetch(route, true, { submittedAt });
        return response?.status === 200;
    } catch (err) {
        return undefined;
    }
};

export const rejectImage = async ({
    dispatch,
    submittedAt,
}: {
    dispatch: Dispatch<AlbumsAction>;
    submittedAt: string;
}) => {
    //dispatch action to AlbumsContext
    dispatch({ type: AlbumsActionTypes.reject, submittedAt });

    //return true if status === 200, else false
    (await rejectImageAPI(submittedAt))
        ? //maybe display a message with a link? Or not, who cares
          console.log(`image successfully rejected`)
        : //should probably display a failure alert... reject failed, added back to queue
          dispatch({ type: AlbumsActionTypes.pending, submittedAt });
};

export default rejectImage;
