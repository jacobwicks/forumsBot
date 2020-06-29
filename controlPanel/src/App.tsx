import React, { useContext, useEffect, useState, useCallback } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ControlPanel from './components/ControlPanel';
import { Container } from 'semantic-ui-react';
import Instructions from './components/Instructions';
import { LoginContext } from './services/LoginContext';
import Providers from './components/Providers';
import { getHeaders } from './services/Api/services/Headers';
import authFetch from './services/Api/services/AuthFetch';
import { LoginActionTypes } from './types/types';

const App2 = () => {
    const { isLoggedIn, dispatch } = useContext(LoginContext);
    const [hasMounted, setHasMounted] = useState(false);

    const checkToken = useCallback(async () => {
        const token = getHeaders();
        if (token) {
            const route = 'authenticate';

            const response = await authFetch(route);

            response?.status === 200
                ? dispatch({ type: LoginActionTypes.success })
                : dispatch({ type: LoginActionTypes.logout });
        }
    }, [dispatch]);

    useEffect(() => {
        if (!hasMounted) {
            setHasMounted(true);
            checkToken();
        }
    }, [hasMounted, setHasMounted, checkToken]);

    return (
        <React.Fragment>
            <TopBar />
            <Container text={!isLoggedIn}>
                {isLoggedIn ? <ControlPanel /> : <Instructions />}
            </Container>
        </React.Fragment>
    );
};

const App = () => (
    <Providers>
        <App2 />
    </Providers>
);
export default App;
