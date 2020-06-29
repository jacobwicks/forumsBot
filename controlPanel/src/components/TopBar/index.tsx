import React, { useContext, useState, useEffect } from 'react';
import { Header, Icon, Menu } from 'semantic-ui-react';
//import { botName } from '../../config.json';
import { LoginContext } from '../../services/LoginContext';
import LoginModal from '../LoginModal';
import { getBotName } from '../../services/Api';
import { LoginActionTypes, BotFetchKeys } from '../../types/types';
import { BotContext } from '../../services/BotContext';
import { logout } from '../../services/Api/';

const ControlPanelLink = () => {
    const { dispatch, isLoggedIn } = useContext(LoginContext);
    return isLoggedIn ? (
        <Icon
            title="Bot Instructions Page"
            name="file outline"
            link
            onClick={() => logout(dispatch)}
            size="large"
        />
    ) : (
        <Icon
            title="Bot Control Panel"
            name="setting"
            link
            onClick={() => dispatch({ type: LoginActionTypes.openModal })}
            size="large"
        />
    );
};

const Title = () => {
    const { fetching, settings } = useContext(BotContext);
    const [botName, setBotName] = useState('');
    const [botNameFetching, setBotNameFetching] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);

    useEffect(() => {
        if (settings) {
            setBotName(settings.botName);
        } else if (
            !botName &&
            !fetching.includes(BotFetchKeys.settings) &&
            !botNameFetching &&
            !hasFailed
        ) {
            _getBotName();
        }
    }, [botName, fetching, botNameFetching, hasFailed, settings]);

    const _getBotName = async () => {
        setBotNameFetching(true);
        const botName = await getBotName();
        setBotNameFetching(false);

        botName ? setBotName(botName) : setHasFailed(true);
    };

    return <Header size="large" content={`${botName}, an SA Forums Bot`} />;
};

const menuItems = [
    <ControlPanelLink />,
    <Title />,
    <LoginModal />,
].map((element, index) => <Menu.Item key={index}>{element}</Menu.Item>);

const TopBar = () => <Menu children={menuItems} color="green" inverted />;

export default TopBar;
