import React, { createContext, useReducer } from 'react';
import { ImageReviewStatus, Album, Albums } from '../../types/types';
import log from '../Log';
import { AlbumsAction, AlbumsState } from '../../types/types';

export const initialState = {
    album: undefined,
    albums: undefined,
    fetching: false,
    hasFailed: false,
    imageQueue: undefined,
    dispatch: (action: AlbumsAction) => undefined,
} as AlbumsState;

//the reducer handles actions
export const reducer = (state: AlbumsState, action: AlbumsAction) => {
    switch (action.type) {
        case 'accept': {
            const { submittedAt } = action;
            if (state.imageQueue) {
                const imageQueue = [...state.imageQueue];
                const image = imageQueue.find(
                    (image) => image.submittedAt === submittedAt
                );
                image?.status && (image.status = ImageReviewStatus.accepted);
                return { ...state, imageQueue };
            } else return state;
        }
        case 'createNewAlbum': {
            const { album, description, hash } = action;
            const { albums } = state;
            const newAlbums: Albums = { ...albums };

            const newAlbum: Album = {
                description: description ? description : '',
                hash: hash ? hash : '',
                status: true,
            };

            newAlbums[album] = newAlbum;
            return {
                ...state,
                albums: newAlbums,
            };
        }
        case 'delete': {
            const { submittedAt } = action;
            const { imageQueue } = state;
            if (!imageQueue) return state;
            const newQueue = imageQueue.filter(
                (image) => image.submittedAt !== submittedAt
            );
            return { ...state, imageQueue: newQueue };
        }
        case 'deleteAlbum': {
            const { album } = action;
            const { album: currentAlbum, albums, imageQueue } = state;

            //if the current album is this album, set current album to undefined
            //this album is getting deleted and can't be displayed
            const newAlbum = currentAlbum === album ? undefined : currentAlbum;

            //new albums object
            const newAlbums: Albums = { ...albums };
            //delete the album from albums
            delete newAlbums[album];

            //filter all images for album out of the queue
            const newImageQueue = imageQueue?.filter(
                (image) => image.album !== album
            );
            return {
                ...state,
                album: newAlbum,
                albums: newAlbums,
                imageQueue: newImageQueue,
            };
        }
        case 'fetchAlbumsAttempt': {
            return {
                ...state,
                albums: undefined,
                imageQueue: undefined,
                hasFailed: false,
                fetching: true,
            };
        }
        case 'fetchAlbumsFailure': {
            return {
                ...state,
                albums: undefined,
                imageQueue: undefined,
                hasFailed: true,
                fetching: false,
            };
        }
        case 'fetchAlbumsSuccess': {
            const { albums, imageQueue } = action;
            return {
                ...state,
                albums,
                imageQueue,
                hasFailed: false,
                fetching: false,
            };
        }
        case 'pending': {
            const { submittedAt } = action;
            if (state.imageQueue) {
                const imageQueue = [...state.imageQueue];
                const image = imageQueue.find(
                    (image) => image.submittedAt === submittedAt
                );
                image?.status && (image.status = ImageReviewStatus.pending);
                return { ...state, imageQueue };
            } else return state;
        }
        case 'reject': {
            const { submittedAt } = action;
            if (state.imageQueue) {
                const imageQueue = [...state.imageQueue];
                const image = imageQueue.find(
                    (image) => image.submittedAt === submittedAt
                );
                image?.status && (image.status = ImageReviewStatus.rejected);
                return { ...state, imageQueue };
            } else return state;
        }
        case 'setAlbum': {
            const { album } = action;
            return { ...state, album };
        }
        case 'setDescription': {
            const { album, value } = action;
            const { albums } = state;
            if (!albums) return state;
            const newAlbum = { ...albums[album] };
            newAlbum.description = value;

            return {
                ...state,
                albums: {
                    ...albums,
                    [album]: newAlbum,
                },
            };
        }
        case 'setFetchingImageQueue': {
            const { fetching } = action;
            return {
                ...state,
                fetching,
            };
        }
        case 'setImageQueue': {
            const { imageQueue } = action;
            return {
                ...state,
                imageQueue,
            };
        }
        case 'setHash': {
            const { album, value } = action;
            const { albums } = state;
            if (!albums) return state;
            const newAlbum = { ...albums[album] };
            newAlbum.hash = value;

            return {
                ...state,
                albums: {
                    ...albums,
                    [album]: newAlbum,
                },
            };
        }
        case 'setName': {
            const { album, value } = action;
            const { albums, imageQueue } = state;
            if (!albums) return state;

            const newAlbums = { ...albums };
            newAlbums[value] = { ...newAlbums[album] };
            delete newAlbums[album];

            const newQueue = imageQueue?.map((image) =>
                image.album === album ? { ...image, album: value } : image
            );

            return {
                ...state,
                album: value,
                albums: newAlbums,
                imageQueue: newQueue,
            };
        }
        case 'setReview': {
            const { review } = action;
            return { ...state, review: !!review };
        }
        case 'setStatus': {
            const { album, value } = action;
            const { albums } = state;
            if (!albums) return state;
            const newAlbum = { ...albums[album] };
            newAlbum.status = value;

            return {
                ...state,
                albums: {
                    ...albums,
                    [album]: newAlbum,
                },
            };
        }
        default:
            //log the bad action
            log('albumsContext reducer received bad action', action);

            //return the current state unchanged
            return state;
    }
};

const AlbumsContext = createContext(initialState);

//the Props that the AlbumsProvider will accept
type AlbumsProps = {
    //You can put react components inside of the Provider component
    children: React.ReactNode;

    //We might want to pass a state into the Provider for testing purposes
    testState?: AlbumsState;

    testDispatch?: (args: any) => void;
};

const AlbumsProvider = ({ children, testState, testDispatch }: AlbumsProps) => {
    //useReducer returns an array containing the state at [0]
    //and the dispatch method at [1]
    //use array destructuring to get state and dispatch
    const [state, dispatch] = useReducer(
        reducer,
        testState ? testState : initialState
    );

    //add dispatch to value object and cast to AlbumsState
    const value = {
        ...state,
        dispatch,
    } as AlbumsState;

    return (
        <AlbumsContext.Provider value={value}>
            {children}
        </AlbumsContext.Provider>
    );
};

export { AlbumsContext, AlbumsProvider };
