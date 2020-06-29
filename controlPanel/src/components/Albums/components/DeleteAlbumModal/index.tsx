import React, { useContext, useState } from 'react';
import { Modal, Icon, Button, Message, Input } from 'semantic-ui-react';
import { AlbumsContext } from '../../../../services/AlbumsContext';
import { deleteAlbum } from '../../../../services/Api';

const DeleteAlbumModal = ({
    album,
    close,
    open,
}: {
    album: string;
    close: () => void;
    open: boolean;
}) => {
    const { dispatch } = useContext(AlbumsContext);
    const [canDelete, setCanDelete] = useState(Boolean);

    return (
        <Modal closeOnDimmerClick onClose={() => close()} open={open}>
            <Modal.Header>Delete {album}?</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Message warning>
                        <Message.Header>
                            Deleting this album from the SA Bot does not also
                            delete it off of imgur.
                        </Message.Header>
                        <p>
                            Deleting this album will delete all pending images
                            for this album from the queue.
                        </p>
                    </Message>
                    <p>
                        Type the name of the album and click 'Delete' to delete
                    </p>
                    <Input
                        onChange={(e, { value }: { value: string }) =>
                            setCanDelete(
                                value?.toLowerCase() === album.toLowerCase()
                            )
                        }
                    />
                    <br />
                    <br />
                </Modal.Description>
                <Modal.Actions>
                    <Button color="green" onClick={() => close()}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!canDelete}
                        color={canDelete ? 'red' : undefined}
                        onClick={() =>
                            deleteAlbum({
                                album,
                                dispatch,
                            })
                        }
                    >
                        <Icon name="exclamation" /> Delete
                    </Button>
                </Modal.Actions>
            </Modal.Content>
        </Modal>
    );
};

export default DeleteAlbumModal;
