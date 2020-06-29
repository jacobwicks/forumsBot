import React, { useContext } from 'react';
import {
    render,
    cleanup,
    fireEvent,
    getByLabelText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
    AlbumsContext,
    AlbumsProvider,
    initialState,
} from '../../../../services/AlbumsContext';
import {
    AlbumsActionTypes,
    AlbumsState,
    Albums,
    ImageReviewStatus,
    ReviewImage,
} from '../../../../types/types';

import Album from './index';

const exampleAlbums: Albums = {
    schnorkles: {
        description: 'Our favorite polls plane',
        hash: 'fakeHash1',
        status: true,
    },
    snoo: {
        description: 'Adorable rat cartoons',
        hash: 'fakeHash2',
        status: true,
    },
    trump: {
        description: 'a pic of TARMP! And a humorous misspelling',
        hash: 'fakeHash3',
        status: true,
    },
};

const exampleAlbumsState = { ...initialState, albums: exampleAlbums };

const image1: ReviewImage = {
    album: 'snoo',
    image: 'whatever',
    submittedAt: new Date('2020-05-21T20:47:40.950Z'),
    submittedById: 12345,
    submittedByName: 'whoever',
    submittedByAvatar: 'stringAvatar',
    status: ImageReviewStatus.pending,
};

const image2: ReviewImage = {
    album: 'snoo',
    image: 'whatever',
    submittedAt: new Date('2020-05-21T22:05:01.263Z'),
    submittedById: 12345,
    submittedByName: 'whoever',
    submittedByAvatar: 'stringAvatar',
    status: ImageReviewStatus.pending,
};

const image3: ReviewImage = {
    album: 'schnorkles',
    image: 'whatever',
    submittedAt: new Date('2020-05-21T22:05:23.134Z'),
    submittedById: 12345,
    submittedByName: 'whoever',
    submittedByAvatar: 'stringAvatar',
    status: ImageReviewStatus.pending,
};

const image4: ReviewImage = {
    album: 'snoo',
    image: 'whatever',
    submittedAt: new Date('2020-05-21T22:05:58.104Z'),
    submittedById: 12345,
    submittedByName: 'whoever',
    submittedByAvatar: 'stringAvatar',
    status: ImageReviewStatus.pending,
};

const exampleImageQueue: ReviewImage[] = [image1, image2, image3, image4];

const exampleImageQueueState: AlbumsState = {
    ...initialState,
    albums: exampleAlbums,
    imageQueue: exampleImageQueue,
};

//a container component to hold  Buttons
//submit() changes answered from false to true
const AlbumInContext = ({
    album,
    testState,
}: {
    album?: string;
    testState?: AlbumsState;
}) => {
    //const [answered, setAnswered] = useState(answeredStartsAs !== undefined ? answeredStartsAs : false);
    return (
        <AlbumsProvider testState={testState}>
            <Album album={album ? album : 'no album name given'} />
        </AlbumsProvider>
    );
};

const renderAlbumsState = (album?: string) =>
    render(<AlbumInContext testState={exampleAlbumsState} album={album} />);

const renderImageQueueState = (album?: string) =>
    render(<AlbumInContext testState={exampleImageQueueState} album={album} />);

describe('renders', () => {
    it('renders without crashing', () => {
        render(<Album />);
    });

    it('renders inside of context provider', () => {
        render(<AlbumInContext />);
    });
});

describe('basic display', () => {
    it('shows the desired album name', () => {
        const album = Object.keys(exampleAlbums)[0];
        const { getByText } = renderAlbumsState(album);

        const albumName = getByText(album);

        expect(albumName).toBeInTheDocument();
    });

    it('shows the album description', () => {
        const albumName = Object.keys(exampleAlbums)[0];
        const album = exampleAlbums[albumName];
        const { description } = album;
        const { getByText } = renderAlbumsState(albumName);

        const descriptionDisplay = getByText(description);

        expect(descriptionDisplay).toBeInTheDocument();
    });

    it('shows the album hash', () => {
        const albumName = Object.keys(exampleAlbums)[0];
        const album = exampleAlbums[albumName];
        const { hash } = album;
        const { getByText } = renderAlbumsState(albumName);

        const hashDisplay = getByText(hash);

        expect(hashDisplay).toBeInTheDocument();
    });

    describe('shows the album active status', () => {
        it('shows the album active status when true', () => {
            const albumName = Object.keys(exampleAlbums)[0];
            const albumsStatusTrue = { ...exampleAlbums };
            albumsStatusTrue[albumName].status = true;
            const testState = { ...initialState, albums: albumsStatusTrue };

            const { getByTestId } = render(
                <AlbumInContext testState={testState} album={albumName} />
            );

            const statusDisplay = getByTestId('status');
            const checkbox = statusDisplay.children[0] as HTMLInputElement;

            expect(checkbox).toBeInTheDocument();

            expect(checkbox.checked).toBe(true);
        });

        it('shows the album active status when false', () => {
            const albumName = Object.keys(exampleAlbums)[0];
            const albumsStatusTrue = { ...exampleAlbums };
            albumsStatusTrue[albumName].status = false;
            const testState = { ...initialState, albums: albumsStatusTrue };

            const { getByTestId } = render(
                <AlbumInContext testState={testState} album={albumName} />
            );

            const statusDisplay = getByTestId('status');
            const checkbox = statusDisplay.children[0] as HTMLInputElement;

            expect(checkbox).toBeInTheDocument();

            expect(checkbox.checked).toBe(false);
        });
    });
});

describe('imageQueue', () => {
    it('says no images are waiting for review', () => {
        const albumName = Object.keys(exampleAlbums)[0];
        const testState = {
            ...exampleImageQueueState,
            imageQueue: exampleImageQueueState.imageQueue?.filter(
                (image) => image.album !== albumName
            ),
        };

        const { getByText } = render(
            <AlbumInContext testState={testState} album={albumName} />
        );

        const queueDisplay = getByText(/no images to review for this album/i);

        expect(queueDisplay).toBeInTheDocument();
    });

    it('displays how many images are waiting for review', () => {
        const albumName = Object.keys(exampleAlbums)[0];
        const { imageQueue } = exampleImageQueueState;
        const imageNumber = imageQueue?.filter(
            (image) => image.album === albumName
        ).length as number;

        if (!imageNumber) throw new Error('example image queue missing');

        const { getByText } = renderImageQueueState(albumName);

        const queueDisplay = getByText(/images to review for this album/i);

        expect(queueDisplay).toBeInTheDocument();
        expect(queueDisplay).toHaveTextContent(imageNumber.toString());
    });
});
