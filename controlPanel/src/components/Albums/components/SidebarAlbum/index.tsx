import React, { useContext } from 'react';
import { Label, Popup } from 'semantic-ui-react';
import { AlbumsContext } from '../../../../services/AlbumsContext';
import { ImageReviewStatus, AlbumsActionTypes } from '../../../../types/types';

const SidebarAlbum = ({ album }: { album: string }): JSX.Element => {
    const { dispatch, album: currentAlbum, imageQueue } = useContext(
        AlbumsContext
    );

    //filter the image queue to the pending images for this albumg
    const images = imageQueue?.filter(
        (img) =>
            img.album.toLowerCase() === album.toLowerCase() &&
            img.status === ImageReviewStatus.pending
    ).length;

    return (
        <div style={{ marginBottom: 10, marginTop: 10 }}>
            <Label
                color={album === currentAlbum ? 'green' : undefined}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                    dispatch({
                        type: AlbumsActionTypes.setAlbum,
                        album,
                    })
                }
            >
                {album}
            </Label>
            <Popup
                content={`Click to review images for ${album}`}
                disabled={!images}
                trigger={
                    <Label
                        style={{ cursor: 'pointer' }}
                        size="large"
                        color={images ? 'red' : undefined}
                        onClick={() => {
                            dispatch({
                                type: AlbumsActionTypes.setAlbum,
                                album,
                            });
                            images &&
                                dispatch({
                                    type: AlbumsActionTypes.setReview,
                                    review: true,
                                });
                        }}
                    >
                        {images}
                    </Label>
                }
            />
        </div>
    );
};

export default SidebarAlbum;
