import React, { useContext, useEffect } from 'react';
import { loadApi } from '../../../../services/Api/services/APIs';
import { ApiContext } from '../../../../services/ApiContext';
import ArrayDisplay from '../ArrayDisplay';
import ObjectDisplay from '../ObjectDisplay';
import Instructions from '../Instructions';
import ApiInput from '../ApiInput';

const ApiDisplay = ({ api }: { api: string }) => {
    const { dispatch, apis, failed, fetching } = useContext(ApiContext);

    useEffect(() => {
        !fetching.includes(api) &&
            !failed.includes(api) &&
            !!apis[api] &&
            !Object.keys(apis[api]).length &&
            loadApi({ api, dispatch });
    }, [dispatch, apis, api, failed, fetching]);

    const instructionChild = <Instructions api={api} />;
    const thisApi = apis[api];

    const configKeys = ['apis', api];

    const apiChild =
        typeof thisApi === 'string' ? (
            <ApiInput api={api} value={thisApi} />
        ) : (
            Object.entries(thisApi).map(([key, value], index) => {
                return (
                    <div key={index}>
                        {typeof value === 'object' ? (
                            Array.isArray(value) ? (
                                <ArrayDisplay
                                    api={api}
                                    keys={configKeys}
                                    array={value}
                                    name={key}
                                />
                            ) : (
                                <ObjectDisplay
                                    api={api}
                                    keys={configKeys}
                                    object={value}
                                    name={key}
                                />
                            )
                        ) : (
                            <ApiInput api={api} input={key} value={value} />
                        )}
                    </div>
                );
            })
        );

    return (
        <>
            {instructionChild}
            {apiChild}
        </>
    );
};

export default ApiDisplay;
