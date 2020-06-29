import React, { useContext, useState, useEffect } from 'react';
import { Button, Icon, Input, Modal } from 'semantic-ui-react';
import { ApiContext } from '../../../../../../services/ApiContext';
import { getImgurToken } from '../../../../../../services/Api/services/APIs';

const GetTokenModal = ({
    close,
    open,
}: {
    close: () => void;
    open: boolean;
}) => {
    const { dispatch, apis, fetching } = useContext(ApiContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isFetching = fetching.includes('imgur');
    const imgur = apis?.imgur;

    //disable the get token button if there isn't a username and password
    const disabled = !username || !password || isFetching;

    useEffect(() => {
        !isFetching && close();
    }, [close, isFetching]);

    return (
        <Modal
            closeOnEscape
            closeOnDimmerClick
            open={open}
            onClose={() => close()}
        >
            <Modal.Header>Get Imgur Token</Modal.Header>
            <Modal.Content>
                <Input
                    label={{ content: 'Imgur Username' }}
                    onChange={({ target }) => setUsername(target.value)}
                    value={username}
                />
                <br />
                <br />
                <Input
                    label={{ content: 'Imgur Password' }}
                    onChange={({ target }) => setPassword(target.value)}
                    value={password}
                    type={'password'}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => close()}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button
                    color="green"
                    disabled={disabled}
                    loading={isFetching}
                    onClick={() =>
                        getImgurToken({
                            dispatch,
                            imgur,
                            username,
                            password,
                        })
                    }
                >
                    <Icon name="checkmark" />
                    Get Token
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default GetTokenModal;
