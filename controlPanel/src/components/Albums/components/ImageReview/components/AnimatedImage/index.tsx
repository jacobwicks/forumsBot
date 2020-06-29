import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { directions } from '../..';

const variants = {
    enter: ({ enterDirection }: { enterDirection: directions }) => {
        return {
            //from the right side of the screen
            x:
                enterDirection === directions.left
                    ? -1000
                    : enterDirection === directions.right
                    ? 1000
                    : 0,

            //image fades as it leaves
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: ({ exitDirection }: { exitDirection: directions }) => {
        return {
            zIndex: 0,

            //from the right side of the screen
            // prettier-ignore
            x:
                exitDirection === directions.left
                    ? -1000
                    : exitDirection === directions.right
                        ? 1000
                        : 0,

            //to the bottom of the screen (1000)
            //or to the top -1000
            //y: direction < 0 ? 1000 : -1000,
            // prettier-ignore
            y:  exitDirection === directions.down
                    ? 1000
                    : exitDirection === directions.up
                        ? -1000
                        : 0,
            //image fades as it leaves
            opacity: 0,
        };
    },
};

const AnimatedImage = ({
    custom,
    image,
    keyProp,
}: {
    custom: {
        enterDirection: directions;
        exitDirection: directions;
    };
    image: string;
    keyProp: number;
}) =>
    image ? (
        <AnimatePresence initial={false} custom={custom}>
            <motion.img
                key={keyProp}
                src={image}
                custom={custom}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ maxWidth: 300, maxHeight: 300, position: 'absolute' }}
                transition={{
                    x: { type: 'spring', stiffness: 300, damping: 200 },
                    opacity: { duration: 0.2 },
                }}
            />
        </AnimatePresence>
    ) : (
        <></>
    );

export default AnimatedImage;
