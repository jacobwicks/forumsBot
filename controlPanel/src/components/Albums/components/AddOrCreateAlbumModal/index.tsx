import React, { useContext, useState, useEffect } from 'react';
import { Button, Popup } from 'semantic-ui-react';
import { AlbumsContext } from '../../../../services/AlbumsContext';
import AddExistingAlbumModal from './components/AddExistingAlbumModal';
import CreateAlbumModal from './components/CreateAlbumModal';

const AddOrCreateAlbumModal = () => {
    const { album } = useContext(AlbumsContext);
    const [open, setOpen] = useState(false);
    const [addExisting, setAddExisting] = useState(false);

    //close when album changes
    useEffect(() => {
        setOpen(false);
        setAddExisting(false);
    }, [album]);

    return (
        <>
            <Popup
                content="Create new album or Add existing album"
                trigger={
                    <Button
                        float="right"
                        icon="add"
                        onClick={() => setOpen(true)}
                    />
                }
            />
            {addExisting ? (
                <AddExistingAlbumModal
                    showCreateNew={() => setAddExisting(false)}
                    close={() => {
                        setOpen(false);
                    }}
                    open={open}
                />
            ) : (
                <CreateAlbumModal
                    addExisting={() => setAddExisting(true)}
                    close={() => {
                        setOpen(false);
                    }}
                    open={open}
                />
            )}
        </>
    );
};

export default AddOrCreateAlbumModal;
