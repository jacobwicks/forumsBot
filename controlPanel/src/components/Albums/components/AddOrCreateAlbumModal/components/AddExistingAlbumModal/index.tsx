import React, { useContext, useState } from 'react';
import { Modal, Icon, Button, Message, Input } from 'semantic-ui-react';
import { AlbumsContext } from '../../../../../../services/AlbumsContext';
import addExistingAlbum from '../../../../../../services/Api/services/Albums/AddExistingAlbum';

const AddExistingAlbumModal = ({
    showCreateNew,
    close,
    open,
}: {
    showCreateNew: () => void;
    close: () => void;
    open: boolean;
}) => {
    const { dispatch } = useContext(AlbumsContext);
    const [hash, setHash] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    return (
        <Modal closeOnDimmerClick onClose={() => close()} open={open}>
            <Modal.Header>
                Add existing Imgur Album{' '}
                <Button
                    floated="right"
                    onClick={(e) => {
                        //bubbling will click the dimmer after the other modal renders
                        //the other modal is smaller, so it will think the click was outside of it
                        //and trigger close
                        e.preventDefault();

                        showCreateNew();
                    }}
                >
                    Create New Album
                </Button>
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Message>
                        <Message.Header>
                            Enter a name and the hash of an existing Imgur album
                            to add it to the bot.
                        </Message.Header>
                    </Message>
                    <Input
                        label="Hash"
                        onChange={(e, { value }: { value: string }) =>
                            setHash(value)
                        }
                    />
                    <br />
                    <br />
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
                        disabled={!name || !hash}
                        color={name ? 'green' : undefined}
                        onClick={() =>
                            addExistingAlbum({
                                dispatch,
                                album: name,
                                description,
                                hash,
                            })
                        }
                    >
                        <Icon name="add" />
                        Add Album
                    </Button>
                </Modal.Actions>
            </Modal.Content>
        </Modal>
    );
};

export default AddExistingAlbumModal;
