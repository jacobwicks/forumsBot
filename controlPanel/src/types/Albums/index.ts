import { SAUser } from '../types';

export interface Album {
    description: string;
    hash: string;
    status: boolean;
}

export interface Albums {
    [key: string]: Album;
}

export enum AlbumsActionTypes {
    accept = 'accept',
    addExistingAlbum = 'addExistingAlbum',
    createNewAlbum = 'createNewAlbum',
    delete = 'delete',
    deleteAlbum = 'deleteAlbum',
    fetchAlbumsAttempt = 'fetchAlbumsAttempt',
    fetchAlbumsFailure = 'fetchAlbumsFailure',
    fetchAlbumsSuccess = 'fetchAlbumsSuccess',
    pending = 'pending',
    reject = 'reject',
    report = 'report',
    removeImage = 'removeImage',
    setAlbum = 'setAlbum',
    setDescription = 'setDescription',
    setFetchingImageQueue = 'setFetchingImageQueue',
    setHash = 'setHash',
    setImageQueue = 'setImageQueue',
    setName = 'setName',
    setReview = 'setReview',
    setStatus = 'setStatus',
}

export type AlbumsAction =
    //accepts adds an image to an album
    | { type: AlbumsActionTypes.accept; submittedAt: string }

    //adds an exisiting imgur album
    | {
          type: AlbumsActionTypes.addExistingAlbum;
          album?: string;
          description?: string;
          hash: string;
          status?: boolean;
      }

    //create a new album. user must provide the hash
    | {
          type: AlbumsActionTypes.createNewAlbum;
          album: string;
          description?: string;
          hash?: string;
      }

    //deletes an image from the queue
    | { type: AlbumsActionTypes.delete; submittedAt: string }

    //delete an album. From the bot? or from imgur altogether?
    | { type: AlbumsActionTypes.deleteAlbum; album: string }

    //trying to fetch the albums
    | { type: AlbumsActionTypes.fetchAlbumsAttempt }

    //failed to fetch the albums
    | { type: AlbumsActionTypes.fetchAlbumsFailure }

    //got the albums from the api
    | {
          type: AlbumsActionTypes.fetchAlbumsSuccess;
          albums: Albums;
          imageQueue?: ReviewImage[];
      }

    //sets the status of an image to pending
    | { type: AlbumsActionTypes.pending; submittedAt: string }

    //reject adding an image to an album
    | { type: AlbumsActionTypes.reject; submittedAt: string }

    //remove an image from an album
    | { type: AlbumsActionTypes.removeImage }

    //the image is obscene or illegal
    | { type: AlbumsActionTypes.report }

    //sets the current album to string or undefined
    | { type: AlbumsActionTypes.setAlbum; album?: string }

    //sets the description of an album
    | {
          type: AlbumsActionTypes.setDescription;
          album: string;
          value: string;
      }

    //sets the fetching boolean
    | {
          type: AlbumsActionTypes.setFetchingImageQueue;
          fetching: boolean;
      }

    //sets the image queue array
    | {
          type: AlbumsActionTypes.setImageQueue;
          imageQueue: ReviewImage[];
      }
    //sets the name of the album
    | {
          type: AlbumsActionTypes.setName;
          album: string;
          value: string;
      }
    //turns image review on or off
    | {
          type: AlbumsActionTypes.setReview;
          review?: boolean;
      }

    //sets the album active status
    //if true, album is available for posters to invoke or request image addition
    | {
          type: AlbumsActionTypes.setStatus;
          album: string;
          value: boolean;
      }

    //sets the hash of an album
    | { type: AlbumsActionTypes.setHash; album: string; value: string };

//The Dispatch function
interface AlbumsDispatch {
    dispatch: (action: AlbumsAction) => void;
}

export interface AlbumsType {
    album?: string;
    albums?: Albums;
    imageQueue?: ReviewImage[];
    fetching: boolean;
    hasFailed: boolean;
    review: boolean;
}

//a union type. The Albums state will have a Stats object for any given key
//except dispatch will return the LoggedInDispatch function
export type AlbumsState = AlbumsType & AlbumsDispatch;

//the possible states of an image submitted to be added to an album
export enum ImageReviewStatus {
    //not reviewed yet
    pending = 'PENDING',

    //accepted into the album
    accepted = 'ACCEPTED',

    //rejected from the album
    rejected = 'REJECTED',

    //image is obscene or illegal
    reported = 'REPORTED',
}

export interface ReviewImage {
    album: string;
    image: string;
    submittedAt: string;
    submittedBy: SAUser;
    status: ImageReviewStatus;
}
