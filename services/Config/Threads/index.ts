import { getConfig, writeToConfig } from '..';
import { ArrayThread } from '../../../types';

const threadsConfigKeys = ['threads'];

export const getThreads = async () => {
    const config = await getConfig();
    return config?.threads;
};

export const getThreadsArray = async () => {
    const threads = await getThreads();
    if (!threads) return undefined;

    const threadsArray: ArrayThread[] = Object.keys(threads).map(
        (threadId) => ({
            ...threads[threadId],
            threadId: Number(threadId),
        })
    );

    return threadsArray;
};

export const getThread = async (threadId: number) => {
    const threads = await getThreads();
    return threads?.[threadId];
};

export const setThreadTitle = async ({
    threadId,
    title,
}: {
    threadId: number;
    title: string;
}) => {
    const configKeys = [...threadsConfigKeys, threadId.toString(), 'title'];
    return await writeToConfig({
        allowCreateKey: true,
        configKeys,
        value: title,
    });
};
