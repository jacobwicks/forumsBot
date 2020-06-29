import { Post } from '../../types';
import { sendLogEvent } from '../../services/Events';
import { showPost } from './Urls';
import { Instruction } from '../../types';
import getInstructionsFromPosts from './FromSA/services/GetInstructionsFromPosts';
import getHandleInstructions from './actions';

const getLogInstructions = (instructions: Instruction[]) =>
    instructions.map((instruction) => ({
        ...instruction,
        link: showPost(instruction.id),
    }));

//takes an array of posts, handles them
const getInstructionsAndRunInstructions = async ({
    simulate,
    title,
    posts,
    threadId,
}: {
    simulate: boolean;
    title?: string;
    posts: Post[];
    threadId: number;
}) => {
    const instructions = await getInstructionsFromPosts(posts);

    const singular = instructions.length === 1;

    const text = !!instructions.length
        ? `There ${singular ? 'is' : 'are'} ${instructions.length} instruction${
              singular ? '' : 's'
          } in ${title}, id: ${threadId}`
        : `${title} has no instructions. id: ${threadId}`;

    sendLogEvent({
        text,
        instructions: getLogInstructions(instructions),
    });

    const handleInstructions = await getHandleInstructions;

    await handleInstructions({ instructions, threadId });
};

export default getInstructionsAndRunInstructions;
