import React, { useContext, useState } from 'react';
import { Modal, Icon, Button, Message, Input } from 'semantic-ui-react';
import { AlbumsContext } from '../../../../../../services/AlbumsContext';
import { createNewAlbum } from '../../../../../../services/Api';

const CreateAlbumModal = ({
    addExisting,
    close,
    open,
}: {
    addExisting: () => void;
    close: () => void;
    open: boolean;
}) => {
    const { dispatch } = useContext(AlbumsContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    return (
        <Modal closeOnDimmerClick onClose={() => close()} open={open}>
            <Modal.Header>
                Create New Album{' '}
                <Button floated="right" onClick={() => addExisting()}>
                    Add Existing Album
                </Button>
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Message>
                        <Message.Header>
                            Creates a new album on Imgur and adds it to the SA
                            Bot
                        </Message.Header>
                    </Message>

                    <Input
                        label="Name"
                        onChange={(e, { value }: { value: string }) =>
                            setName(value)
                        }
                    />
                    <br />
                    <br />
                    <Input
                        label="Description"
                        onChange={(e, { value }: { value: string }) =>
                            setDescription(value)
                        }
                    />
                    <br />
                    <br />
                </Modal.Description>
                <Modal.Actions>
                    <Button onClick={() => close()}>Cancel</Button>
                    <Button
                        disabled={!name}
                        color={name ? 'green' : undefined}
                        onClick={() =>
                            createNewAlbum({
                                dispatch,
                                album: name,
                                description,
                            })
                        }
                    >
                        <Icon name="exclamation" />
                        Create Album
                    </Button>
                </Modal.Actions>
            </Modal.Content>
        </Modal>
    );
};

export default CreateAlbumModal;
