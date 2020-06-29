import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import GenericInstructions from '../GenericInstructions';
import { ApiContext } from '../../../../../services/ApiContext';
import getTwitterToken from '../../../../../services/Api/services/APIs/Twitter';

const TwitterInstructions = ({ api }: { api: string }) => {
    const { dispatch, apis, fetching } = useContext(ApiContext);

    const isFetching = fetching.includes('twitter');
    const twitter = apis?.twitter;

    //@ts-ignore
    const consumerKey = twitter?.consumerKey;
    //@ts-ignore
    const consumerSecret = twitter?.consumerSecret;

    //disable the get token button if there isn't a consumerKey and consumerSecret
    const disabled = isFetching || !consumerKey || !consumerSecret;

    const getTokenButton = (
        <Button
            disabled={disabled}
            loading={isFetching}
            onClick={() =>
                getTwitterToken({
                    dispatch,
                    twitter,
                })
            }
        >
            {disabled
                ? `You need to fill in the ${
                      !consumerKey ? 'consumerKey' : ''
                  } ${!consumerKey && !consumerSecret ? 'and' : ''} ${
                      !consumerSecret ? 'consumerSecret' : ''
                  }.`
                : 'Get Token'}
        </Button>
    );

    const addChildren = [getTokenButton];

    return <GenericInstructions api={api} addChildren={addChildren} />;
};

export default TwitterInstructions;
