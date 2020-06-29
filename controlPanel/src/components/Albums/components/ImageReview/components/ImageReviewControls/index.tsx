import React from 'react';
import { Button, Segment } from 'semantic-ui-react';

const ImageReviewControls = ({
    acceptImage,
    rejectImage,
    lastImage,
    firstImage,
    nextImage,
    prevImage,
}: {
    acceptImage: () => void;
    rejectImage: () => void;
    firstImage: () => void;
    lastImage: () => void;

    nextImage: () => void;
    prevImage: () => void;
}) => (
    <Segment>
        <Button icon="backward" onClick={() => firstImage()} />
        <Button icon="step backward" onClick={() => prevImage()} />
        <Button color="green" icon="thumbs up" onClick={() => acceptImage()} />
        <Button color="red" icon="thumbs down" onClick={() => rejectImage()} />
        <Button icon="step forward" onClick={() => nextImage()} />
        <Button icon="forward" onClick={() => lastImage()} />
    </Segment>
);

export default ImageReviewControls;
