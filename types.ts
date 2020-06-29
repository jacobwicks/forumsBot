export type Trigger = string | RegExp;

interface Action {
    active: boolean;
    triggers: Trigger[];
}

interface Actions {
    [key: string]: Action;
}

interface Album {
    description: string | undefined;
    hash: string;
    status: boolean;
}

interface Albums {
    [key: string]: Album;
}

interface ApiBotSettings {
    //the name that posters use to get the bot's attention
    botName: string;

    //the username and password of the SA account the bot uses
    creds: Creds;

    cookies: {
        exist: boolean;
    };

    //how often the bot runs in minutes
    interval: number;

    //If the bot is set to run every interval or not
    on: boolean;

    //if the bot is currently running or not
    running: boolean;
}

interface ConfigJSON {
    //the actions the bot can take
    actions: Actions;

    //the imgur albums connected to the bot
    albums: Albums;

    //the api keys that the bot uses
    apis: any;

    //the cookies that SA forums issue
    cookies: KeyString;

    //the array of images posters have submitted for addition to albums
    imageQueue: ReviewImage[];

    //the password for the bot api
    password: string;

    //the old puppeteer stuff
    puppeteer: {
        cookies: SACookie[];
    };

    settings: ApiBotSettings;

    //user annotation of threads monitored by bot
    threads: {
        [key: string]: Thread;
    };

    //fix this later- for indexing in FromConfig procedure
    [key: string]: object | string | undefined;
}

interface Creds {
    username: string;
    password: string;
}

//the possible states of an image submitted to be added to an album
enum ImageReviewStatus {
    //not reviewed yet
    pending = 'PENDING',

    //accepted into the album
    accepted = 'ACCEPTED',

    //rejected from the album
    rejected = 'REJECTED',

    //image is obscene or illegal
    reported = 'REPORTED',
}

export interface Instruction extends Post {
    instruction: string;
}

export interface KeyString {
    [key: string]: string;
}

interface ReviewImage {
    album: string;
    image: string;
    submittedAt: string;
    submittedBy: SAUser;
    status: ImageReviewStatus;
}

export interface SAUser {
    avatar?: string;
    id: number;
    name: string;
    title?: string;
    profile: string;
    regDate: string;
}

//the cookies from SA forums
interface SACookie {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    size: number;
    httpOnly: boolean;
    secure: boolean;
    session: boolean;
}
import { Page } from 'puppeteer';

//limits on where to scan in a thread
export interface ThreadLimits {
    startPage: number;
    startPost?: number;
    stopPage?: number;
    stopPost?: number;
}

//the relevant parts of a post scraped from the forums
//posts start as Element, but we grab these from them
// export interface Post {
//     //the url of the author user's avatar image
//     avatar?: string;

//     //the name of the user that wrote the post
//     author: string;

//     //the body of the post, without other quoted posts inside it
//     body: string;

//     //the date the post was made
//     date: Date;

//     //the unique postId number
//     id: number;

//     //the img.src property
//     image?: string;

//     //the title text of the author user
//     title?: string;
// }

export interface Post {
    //the name of the user that wrote the post
    author: SAUser;

    //the body of the post, without other quoted posts inside it
    body: string;

    //the date the post was made
    date: Date;

    //the unique postId number
    id: number;

    //the img.src property
    image?: string;

    //the img.src property of all images in the post except forums smileys
    images: string[];

    //a link to the post
    link: string;
}

export interface PostManipulatedImageProps extends RespondToPostProps {
    //the url of the image to be widened
    image: string;
}

//an interface for a response that quotes a specific postId
export interface RespondToPostProps {
    post: Post;

    //the id of the post that will be quoted
    postId: number;

    //the thread where the post is
    threadId?: number;
}

//a thread that the bot monitors
export interface Thread {
    //active is true if it was bookmarked
    //the last time we got bookmarked threads from the forums page
    bookmarked: boolean;

    //optional limits on scanning the thread
    //start at X page, post, stop at Y page, post
    limit?: ThreadLimits;

    //human readable name
    //designated by you, the person running the bot
    //goes in the logs
    name?: string;

    //title from the forums
    //this is often changed
    title?: string;

    pages: number;
}

export interface ArrayThread extends Thread {
    threadId: number;
}

export {
    Action,
    Actions,
    Album,
    Albums,
    ConfigJSON,
    Creds,
    ImageReviewStatus,
    ReviewImage,
    SACookie,
};
