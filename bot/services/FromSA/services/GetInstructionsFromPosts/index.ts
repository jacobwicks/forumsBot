import { Post, Instruction } from '../../../../../types';
import { getBotName } from '../../../../../services/Config';

const isInstruction = (body: string, botName: string) =>
    body.slice(0, botName.length).toLowerCase() === botName.toLowerCase();

const getInstructionFromBody = (body: string, botName: string) =>
    body
        .slice(botName.length + 1)
        .trim()
        .toLowerCase();

const getInstructionsFromPosts = async (
    posts: Post[]
): Promise<Instruction[]> => {
    const botName = await getBotName();

    if (!botName) return [];

    return posts
        .filter((post) => isInstruction(post.body, botName))
        .map((post) => ({
            ...post,
            instruction: getInstructionFromBody(post.body, botName),
        })) as Instruction[];
};

export default getInstructionsFromPosts;
