import addTyposToString, {
    defaultSettings,
} from '../../typos/addTyposToString';

const getTrump = () => {
    const inputString = 'Trump!';

    const settings = {
        ...defaultSettings,
        extraCharacters: 40,
        frequency: 35,
        missedCharacters: 25,
    };

    return addTyposToString({
        inputString,
        settings,
    });
};

const getContent = ({ image }: { image: string }) =>
    `[img]${image}[/img]\n${getTrump()}`;

export { getContent };
