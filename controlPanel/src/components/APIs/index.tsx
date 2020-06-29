import React, { useContext, useEffect } from 'react';
import loadAPIs from '../../services/Api/services/APIs';
import { ApiActionTypes } from '../../types/types';
import { Header, Label, Grid } from 'semantic-ui-react';
import { ApiContext } from '../../services/ApiContext';
import ApiDisplay from './components/ApiDisplay';

const APIs = () => {
    const { dispatch, apis, current, failed, fetching } = useContext(
        ApiContext
    );

    useEffect(() => {
        !fetching.includes('apis') &&
            !failed.includes('apis') &&
            !Object.keys(apis).length &&
            loadAPIs(dispatch);
    }, [dispatch, apis, fetching, failed]);

    return (
        <Grid divided>
            <Grid.Column width={4}>
                <Header as="h2">APIs </Header>
                <div>
                    {apis &&
                        Object.keys(apis)
                            .sort()
                            .map((api, index) => (
                                <div key={index}>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            dispatch({
                                                type: ApiActionTypes.setCurrent,
                                                current: api,
                                            })
                                        }
                                    >
                                        <Label
                                            color={
                                                current === api
                                                    ? 'green'
                                                    : undefined
                                            }
                                        >
                                            {api}
                                        </Label>
                                    </div>
                                    <br />
                                </div>
                            ))}
                </div>
            </Grid.Column>
            <Grid.Column width={12}>
                {current && apis?.[current] && <ApiDisplay api={current} />}
            </Grid.Column>
        </Grid>
    );
};

export default APIs;
