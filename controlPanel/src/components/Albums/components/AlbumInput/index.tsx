import React, { useContext } from 'react';
import { AlbumsActionTypes } from '../../../../types/types';
import { AlbumsContext } from '../../../../services/AlbumsContext';
import EditableInput from '../../../EditableInput';

const AlbumInput = ({
    album,
    checkbox,
    input,
    textArea,
    type,
    value,
}: {
    album: string;

    //render a checkbox
    checkbox?: boolean;

    //the type of action to set the input value
    type: AlbumsActionTypes;

    //the input
    input: string;

    //render a textarea
    textArea?: boolean;

    //the old value of the input
    value?: string | boolean;
}) => {
    const { dispatch } = useContext(AlbumsContext);
    const configKeys = ['albums', album];

    return (
        <EditableInput
            checkbox={checkbox}
            configKeys={configKeys}
            dispatch={dispatch}
            dispatchBefore={[{ type, album } as any]}
            dispatchOnFailure={[
                {
                    type,
                    album,
                    value,
                } as any,
            ]}
            input={input}
            textArea={textArea}
            value={value}
        />
    );
};

export default AlbumInput;
