import authFetch from '../../AuthFetch';

const markLastRead = async ({
    page,
    threadId,
}: {
    page: number;
    threadId: number;
}) => {
    const route = 'markLastRead';

    const response = await authFetch(route, true, { page, threadId });

    return response?.status === 200;
};

export default markLastRead;
