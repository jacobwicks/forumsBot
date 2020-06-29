import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import GenericInstructions from '../GenericInstructions';
import GetTokenModal from './GetTokenModal';

const ImgurInstructions = ({ api }: { api: string }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const getTokenButton = (
        <Button onClick={() => setModalOpen(true)}>Get Token</Button>
    );

    const addChildren = [getTokenButton];

    return (
        <>
            <GenericInstructions api={api} addChildren={addChildren} />
            <GetTokenModal close={() => setModalOpen(false)} open={modalOpen} />
        </>
    );
};

export default ImgurInstructions;
