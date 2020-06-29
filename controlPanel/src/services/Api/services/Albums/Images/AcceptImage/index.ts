import { authFetchJSON } from '../../../AuthFetch';
import { AlbumsAction, AlbumsActionTypes } from '../../../../../../types/types';
import { Dispatch } from 'react';

interface AcceptImageResponse {
    uploadedImageUrl: string;
}

const acceptImageAPI = async (submittedAt: string) => {
    const route = 'acceptImage';

    try {
        //call fetch at the loginUrl
        const response = (await authFetchJSON(route, true, {
            submittedAt,
        })) as AcceptImageResponse | undefined;

        return response?.uploadedImageUrl;
    } catch (err) {
        return undefined;
    }
};

const acceptImage = async ({
    dispatch,
    submittedAt,
}: {
    dispatch: Dispatch<AlbumsAction>;
    submittedAt: string;
}) => {
    //dispatch action to AlbumsContext
    dispatch({ type: AlbumsActionTypes.accept, submittedAt });

    const uploadedImageUrl = await acceptImageAPI(submittedAt);
    uploadedImageUrl
        ? //maybe display a message with a link? Or not, who cares
          console.log(`image successfully uploaded to`, uploadedImageUrl)
        : //should probably display a failure alert... Upload failed, added back to queue
          dispatch({ type: AlbumsActionTypes.pending, submittedAt });
};

export default acceptImage;
