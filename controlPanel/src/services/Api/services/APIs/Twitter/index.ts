import { ApiAction, Api, ApiActionTypes } from '../../../../../types/Apis';
import { authFetchJSON } from '../../AuthFetch';

interface BearerTokenResponse {
    bearerToken: string;
}

type BR = BearerTokenResponse | undefined;

const getTwitterToken = async ({
    dispatch,
    twitter,
}: {
    dispatch: React.Dispatch<ApiAction>;
    twitter: Api;
}) => {
    if (typeof twitter === 'string') throw Error('twitter is not an object');

    dispatch({ type: ApiActionTypes.fetching, api: 'twitter' });

    const route = 'tokens/twitter';
    const bearerToken = ((await authFetchJSON(route)) as BR)?.bearerToken;

    bearerToken
        ? dispatch({
              type: ApiActionTypes.setApi,
              api: 'twitter',
              value: { ...twitter, bearerToken },
          })
        : dispatch({ type: ApiActionTypes.failed, api: 'twitter' });
};

export default getTwitterToken;
