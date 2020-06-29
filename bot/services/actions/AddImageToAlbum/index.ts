import makePost from '../../MakePost';
import { RespondToPostProps } from '../../../../types';
import getRandomImageFromAlbum from '../../FromOther/getRandomImageFromAlbum';
import { getAlbumCaseInsensitive } from '../../../../services/Config';
import { sendLogEvent } from '../../../../services/Events';
import log from '../../log';
import getPostContent from '../../albums';
import { addImageToImageQueue } from '../../../../services/Images/AddImageToImageQueue';
import { Post } from '../../../../types';

interface PostFromAlbum extends RespondToPostProps {
    album: string;
}

const triggers = [/^\badd\b/gi];

const addImageToAlbum = async ({
    instruction,
    threadId,
    post,
    postId,
}: {
    instruction: string;
    threadId: number;
    post: Post;
    postId: number;
}) => {
    const add = 'add';
    console.log('ADD to album detected');
    //request to add image to imaegCollection starts with 'add'
    instruction = instruction.slice(add.length).trim();

    //may say 'add to' or just 'add'
    //slice off 'to'
    instruction.trim().slice(0, 2) === 'to' &&
        (instruction = instruction.trim().slice(2));

    const album = instruction.trim();

    addImageToImageQueue({
        album,
        post,
    });
};

const name = 'Add Image to Album';

const noPost = true;

export { addImageToAlbum as action, name, noPost, triggers };
