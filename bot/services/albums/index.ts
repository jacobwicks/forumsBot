import { Glob } from 'glob';
import { Instruction } from '../../../types';
import { sendLogEvent } from '../../../services/Events';

//album folder
//exports
/*
album file: {
    getContent: (...args: any) => Promise<void>
    triggers?: (string | RegExp)[];
}

description? file: description of the album. Should this be markdown, or set through the cpanel?

how does this relate to the hash?
*/

interface AlbumFile {
    album: string;
    getContent: (...args: any) => Promise<string>;
}

//looks at all the folders in the albums folder
//and gets the album content functions
const getAlbumsFromFolders = (): {
    [key: string]: (...args: any) => Promise<string>;
} => {
    //find all typescript files in the folders
    const pattern = '**/*.ts';

    //we use glob to search the folders
    //these options control how it works
    const globOptions = {
        //path
        cwd: `${__dirname}`,

        //ignore test files
        ignore: '**/*.test.ts',

        //need to use the synchronous version to get a return value
        sync: true,
    };

    //instantiate the glob
    //the .found property is the array of files that glob finds
    const albums = new Glob(pattern, globOptions).found;

    return (
        albums
            //require each file
            .map((filename: string) => ({
                album: filename?.split('/')?.slice(-2)[0]?.toLowerCase(),
                getContent: require(`../albums/${filename}`)?.getContent,
            }))

            //filter to files that have the right exports
            .filter(
                ({ getContent }) =>
                    //needs to export getContent
                    getContent &&
                    //getContetn needs to be a function
                    typeof getContent === 'function'
            )

            //reduce the array to an array of regexp:getContent and the processor object
            .reduce(
                (acc, file) => {
                    const { album, getContent } = file as AlbumFile;
                    acc[album] = getContent;
                    return acc;
                },

                <{ [key: string]: (...args: any) => Promise<string> }>{}
            )
    );
};

const generateGetPostContent = () => {
    const processor = getAlbumsFromFolders();

    return async ({
        album,
        image,
        ...args
    }: {
        album: string;
        image: string;
        args?: any;
    }) =>
        processor[album]
            ? await processor[album]({ album, image, args })
            : `[img]${image}[/img]`;
};

const getPostContent = generateGetPostContent();

export default getPostContent;
