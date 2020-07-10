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
    waitFirst,
}: {
    simulate: boolean;
    title?: string;
    posts: Post[];
    threadId: number;
    waitFirst?: boolean;
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

    if (instructions.length) {
        const handleInstructions = await getHandleInstructions;

        if (waitFirst) {
            await new Promise((resolve) =>
                setTimeout(() => {
                    console.log('10 seconds for limiter elapsed');
                    resolve();
                }, 10000)
            );
        }

        //handleInstructions returns true if it executed at least one valid instruction
        return await handleInstructions({ instructions, threadId });
    } else return !!waitFirst;
};

export default getInstructionsAndRunInstructions;
