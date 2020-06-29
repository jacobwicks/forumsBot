enum APITypes {
    accessToken = 'accessToken',
    access_token = 'access_token',
    access_token_secret = 'access_token_secret',
    bearerToken = 'bearerToken',
    clientId = 'clientId',
    clientSecret = 'clientSecret',
    consumerKey = 'consumerKey',
    consumerSecret = 'consumerSecret',
}

export type Api = string | { [A in APITypes]?: any };

export interface Apis {
    [key: string]: Api;
}

export enum ApiActionTypes {
    failed = 'failed',
    fetching = 'fetching',
    setCurrent = 'setCurrent',
    setApis = 'setApis',
    setApi = 'setApi',
}

export type ApiAction =
    //failed to fetch an api
    | { type: ApiActionTypes.failed; api: string }

    //getting an api
    | { type: ApiActionTypes.fetching; api: string }

    //setting the currently viewed api
    | { type: ApiActionTypes.setCurrent; current: string }

    //loading all apis
    | { type: ApiActionTypes.setApis; apis: Apis }

    //loading a single api
    | { type: ApiActionTypes.setApi; api: string; value: Api };

//The Dispatch function
interface ApiDispatch {
    dispatch: React.Dispatch<ApiAction>;
}

interface ApiType {
    apis: Apis;
    current: string;
    failed: string[];
    fetching: string[];
}
//a union type. The LoggedIn state will have a Stats object for any given key
//except dispatch will return the LoggedInDispatch function
export type ApiState = ApiType & ApiDispatch;
