import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';

const MyMarkdown = (props: any) => {
    //the maximum width of an image in the markdown
    const maxWidth = props?.maxWidth;

    const imageNodes = new Map();
    const nodeKey = (position: any) => JSON.stringify(position.start); // or use your own hash function

    const allowNodes = (node: any) => {
        if (node.type === 'image') imageNodes.set(nodeKey(node.position), node);
        return true;
    };

    //ReactMarkdown accepts custom renderers
    const renderers = {
        //This custom renderer changes how images are rendered
        //we use it to constrain the max width of an image to its container
        image: ({ alt, src, title }: { alt: any; src: any; title: any }) => (
            <img alt={alt} src={src} title={title} style={{ maxWidth }} />
        ),
    };

    return (
        <ReactMarkdown
            {...props}
            allowNodes={allowNodes}
            linkTarget={'_blank'}
            renderers={renderers}
            rawSourcePos
        />
    );
};

export default MyMarkdown;
