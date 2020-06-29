import fetch from 'node-fetch';

export const apiUrl = 'http://localhost:3001/api/v1/';

export const getBotName = async () => {
    const route = 'botName';
    const url = `${apiUrl}${route}`;
    const res = await fetch(url);
    const botName: string | undefined = (await res.json())?.botName;
    return botName;
};

export * from './services/Actions';
export {
    acceptImage,
    createNewAlbum,
    deleteAlbum,
    loadAlbums,
    loadImageQueue,
    rejectImage,
} from './services/Albums';
export * from './services/Bot';
export * from './services/BotSettings';
export { default as listenToEvents } from './services/Events';
export * from './services/Instructions';
export { default as login } from './services/Login';
export { default as logout } from './services/Logout';
export * from './services/Threads';
