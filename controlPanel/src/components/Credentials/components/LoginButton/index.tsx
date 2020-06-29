import React from 'react';
import { useState } from 'react';
import authFetch from '../../../../services/Api/services/AuthFetch';
import { Button, Icon } from 'semantic-ui-react';

const LoginButton = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [success, setSuccess] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const testCreds = async () => {
        setIsFetching(true);
        //api route
        const route = 'testCreds';
        //expect a JSON response from the fetch request to the route
        const success = (await authFetch(route))?.status === 200;

        //done trying to fetch
        setIsFetching(false);
        setSuccess(success);
        setHasFetched(true);
    };

    return (
        <>
            <Button onClick={() => testCreds()} loading={isFetching}>
                Test Login
            </Button>
            {hasFetched ? (
                success ? (
                    <Icon name="thumbs up outline" />
                ) : (
                    <Icon name="thumbs down outline" />
                )
            ) : undefined}
        </>
    );
};

export default LoginButton;
