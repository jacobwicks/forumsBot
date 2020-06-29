import React, { useContext, useState } from 'react';
import { Button, Icon, Input, Header, Modal } from 'semantic-ui-react';
import { LoginContext } from '../../services/LoginContext';
import { login, logout } from '../../services/Api';

const LoginModal = () => {
    const { modalOpen, loggingIn, dispatch } = useContext(LoginContext);
    const [password, setPassword] = useState('');
    return (
        <Modal open={modalOpen}>
            <Header icon="lock" content="Login to see controls" />
            <Modal.Content>
                <Input
                    type="password"
                    onChange={(e, { value }: { value: string }) =>
                        setPassword(value)
                    }
                />
            </Modal.Content>
            <Modal.Actions>
                <Button basic color="red" onClick={() => logout(dispatch)}>
                    <Icon name="remove" /> No
                </Button>
                {loggingIn ? (
                    <Button color="green" loading />
                ) : (
                    <Button
                        color="green"
                        onClick={() => login({ dispatch, password })}
                    >
                        <Icon name="checkmark" /> Yes
                    </Button>
                )}
            </Modal.Actions>
        </Modal>
    );
};

export default LoginModal;
