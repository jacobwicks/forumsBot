import React, { useEffect, useContext, useCallback, useState } from 'react';
import { Loader, Message, Label, Segment, Header } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';
import Instruction from './components/Instruction';
import TriggerInstruction from './components/TriggerInstruction';
import { getInstructions, getBotName } from '../../services/Api';
import { InstructionsContext } from '../../services/InstructionsContext';
import {
    InstructionsActionTypes,
    AlbumInstruction as AlbumInstructionType,
} from '../../types/types';
import { spacing } from '../../services/Spacing';

const ActionsInstructions = () => {
    const { actions } = useContext(InstructionsContext);

    return (
        <Segment>
            <Header as="h2">Actions</Header>
            {actions?.map(({ example, instructions, key, name, triggers }) => (
                <Instruction
                    input={instructions || ''}
                    key={key}
                    name={name}
                    addChildren={[
                        <TriggerInstruction
                            example={example}
                            triggers={triggers}
                        />,
                    ]}
                />
            ))}
        </Segment>
    );
};

const AlbumInstruction = ({
    albumInstruction,
}: {
    albumInstruction: AlbumInstructionType;
}) => {
    const { botName } = useContext(InstructionsContext);
    const [open, setOpen] = useState(false);

    const { album, description } = albumInstruction;
    return (
        <Segment
            onClick={(e: any) => {
                e.stopPropagation();
                setOpen(!open);
            }}
            style={{ cursor: 'pointer' }}
        >
            <Header as="h3">{album}</Header>
            {open && (
                <div>
                    <div style={spacing}>{description}</div>
                    <Segment>
                        <Header as="h4">
                            Request to add first image in post or first image in
                            quoted post to album {album}
                        </Header>
                        <div>
                            {botName} add {album}
                        </div>
                        <div>
                            {botName} add to {album}
                        </div>
                    </Segment>
                    <Segment>
                        <Header as="h4">Get random image from {album}</Header>
                        <div>
                            {botName} gimme {album}
                        </div>
                        <div>
                            {botName} gimme a {album}
                        </div>
                    </Segment>
                </div>
            )}
        </Segment>
    );
};

const AlbumInstructions = () => {
    const { albums, botName } = useContext(InstructionsContext);
    const [open, setOpen] = useState(false);

    return (
        <Segment onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
            <Header as="h2">Albums</Header>
            {open && (
                <div>
                    <p>The bot stores images in albums.</p>
                    <p>
                        Get a random image from an album by posting "{botName}{' '}
                        gimme" followed by the album name
                    </p>
                    <p>
                        You can request to add the first image in your post to
                        an album by posting "{botName} add" followed by album
                        name
                    </p>
                    {albums.map((albumInstruction, index) => (
                        <AlbumInstruction
                            albumInstruction={albumInstruction}
                            key={index}
                        />
                    ))}
                </div>
            )}
        </Segment>
    );
};

const Instructions = () => {
    const { dispatch, actions, done, fetching, failed, general } = useContext(
        InstructionsContext
    );

    useEffect(() => {
        !fetching && !done && !failed && getInstructions(dispatch);
    }, [actions, dispatch, done, failed, fetching]);

    const loadBotName = useCallback(async () => {
        const botName = await getBotName();
        botName &&
            dispatch({ type: InstructionsActionTypes.setBotName, botName });
    }, [dispatch]);

    useEffect(() => {
        loadBotName();
    }, [loadBotName]);

    if (!actions && fetching) return <Loader active />;

    if (!actions && done)
        return <Message warning>Failed to load Instructions</Message>;

    const addChildren = [];

    addChildren.push(<AlbumInstructions key="albums" />);
    addChildren.push(<ActionsInstructions key="actions" />);
    return (
        <Container>
            {general ? (
                <Instruction
                    name=""
                    input={general}
                    addChildren={addChildren}
                    forceOpen={true}
                />
            ) : (
                <Loader active />
            )}
        </Container>
    );
};

export default Instructions;
