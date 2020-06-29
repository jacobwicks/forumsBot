import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from 'semantic-ui-react';

type IconSizeProp =
    | 'mini'
    | 'tiny'
    | 'small'
    | 'large'
    | 'big'
    | 'huge'
    | 'massive';

const RotatingCog = ({ size }: { size: IconSizeProp }) => (
    <motion.div
        animate={{
            rotate: 360,
        }}
        transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.2, 0.5, 0.8, 1],
            loop: Infinity,
            repeatDelay: 1,
        }}
        style={{
            display: 'inline-block',
        }}
    >
        <Icon size={size ? size : undefined} name="cog" />
    </motion.div>
);

export default RotatingCog;
