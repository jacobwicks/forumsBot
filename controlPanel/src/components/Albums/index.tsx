import React, { useContext, useEffect, useState } from 'react';
import { AlbumsContext } from '../../services/AlbumsContext';
import { loadAlbums, loadImageQueue } from '../../services/Api/';
import { Grid, Button, Segment, Header } from 'semantic-ui-react';
import Album from './components/Album';
import ImageReview from './components/ImageReview';
import { ImageReviewStatus, AlbumsActionTypes } from '../../types/types';
import AddOrCreateAlbumModal from './components/AddOrCreateAlbumModal';
import SideBar from './components/SideBar';

const Albums = () => {
    const [loaded, setLoaded] = useState(false);
    const {
        dispatch,
        album,
        albums,
        hasFailed,
        fetching,
        imageQueue,
        review,
    } = useContext(AlbumsContext);

    useEffect(() => {
        !fetching && !hasFailed && !albums && loadAlbums(dispatch);
    }, [dispatch, fetching, hasFailed, albums]);

    useEffect(() => {
        if (!fetching && !loaded) {
            loadImageQueue(dispatch);
            setLoaded(true);
        }
    }, [dispatch, fetching, loaded, setLoaded]);

    const toReview = imageQueue?.filter(
        (img) => img.status === ImageReviewStatus.pending
    ).length;

    const singular = toReview === 1;

    return (
        <div>
            <Segment>
                <Grid columns={2} divided>
                    <Grid.Column width={4}>
                        <Header as="h2">
                            Albums <AddOrCreateAlbumModal />
                        </Header>
                        <SideBar />
                    </Grid.Column>
                    <Grid.Column>
                        {album && <Album album={album} key={album} />}
                    </Grid.Column>
                </Grid>
            </Segment>
            {imageQueue && (
                <Button
                    onClick={() =>
                        album
                            ? dispatch({
                                  type: AlbumsActionTypes.setAlbum,
                                  album: '',
                              })
                            : dispatch({
                                  type: AlbumsActionTypes.setReview,
                                  review: !review,
                              })
                    }
                >
                    There {singular ? 'is' : 'are'} {toReview ? toReview : 'no'}{' '}
                    image
                    {!singular && 's'} waiting for review
                </Button>
            )}
            {review && <ImageReview album={album} />}
        </div>
    );
};

export default Albums;
