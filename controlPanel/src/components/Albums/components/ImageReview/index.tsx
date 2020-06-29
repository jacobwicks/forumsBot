import React, { useContext, useState, useEffect, useCallback } from 'react';
import usePrevious from '../../../../services/UsePrevious';
import { AlbumsContext } from '../../../../services/AlbumsContext';
import { Header, Segment } from 'semantic-ui-react';
import ImageReviewControls from './components/ImageReviewControls';
import { ImageReviewStatus, ReviewImage } from '../../../../types/types';
import AnimatedImage from './components/AnimatedImage';
import ReviewImageDisplay from './components/ReviewImage';
import { acceptImage, rejectImage } from '../../../../services/Api';

export enum directions {
    down = 'down',
    left = 'left',
    right = 'right',
    up = 'up',
}

const numbers = {
    down: 1,
    left: 2,
    right: 3,
    up: 4,
};

const ImageReview = ({ album }: { album?: string }) => {
    const { dispatch, imageQueue } = useContext(AlbumsContext);
    //the index in the filtered queue
    //of the image that you are currently looking at
    const [qIndex, setQIndex] = useState(0);

    //a number that helps the animation library keep track of images
    const [key, setKey] = useState(0);

    //the directions that images enter and exit the screen
    const [enterDirection, setEnterDirection] = useState(directions.right);
    const [exitDirection, setExitDirection] = useState(directions.left);

    //when true, keeps displaying the image of the prior image
    //used when status changes filteres the pending image out of q
    const [overrideImage, setOverrideImage] = useState(false);

    //makes the current image animate off the screen
    //and brings the new image onscreen
    const animateOut = useCallback(
        (newDirection: directions) => {
            setExitDirection(newDirection);
            setKey(key + numbers[newDirection]);
        },
        [setExitDirection, key, setKey]
    );

    //an array of the current images from this album
    //that have pending status
    const filteredQueue =
        (album
            ? imageQueue?.filter(
                  (i) =>
                      i.album.toLowerCase() === album.toLowerCase() &&
                      i.status === ImageReviewStatus.pending
              )
            : imageQueue?.filter(
                  (i) => i.status === ImageReviewStatus.pending
              )) || [];

    //the current poster submitted image being reviewed
    const reviewImage = filteredQueue[qIndex];

    //submitted at timestamp is unique to each image
    //so its used by the actions/context reducer to identify images
    const submittedAt = reviewImage?.submittedAt;

    //keep these previous references around
    //to complete animating an image offscreen
    //after it has been filtered out of the queue
    const previousAlbum = usePrevious(album);
    const previousReviewImage = usePrevious(reviewImage) as ReviewImage;
    const previousKey = usePrevious(key) as number;
    const previousFilteredQueueLength = usePrevious(filteredQueue.length);

    useEffect(() => {
        if (
            //the album is the same
            album === previousAlbum &&
            //but the queue length changed. Means the prior image status changed
            filteredQueue.length !== previousFilteredQueueLength
        ) {
            setOverrideImage(true);

            if (
                previousReviewImage &&
                previousReviewImage.status === ImageReviewStatus.accepted
            ) {
                setEnterDirection(directions.right);
                //accepted- it flys up off the screen
                animateOut(directions.up);
                setOverrideImage(false);
            }

            if (
                previousReviewImage &&
                previousReviewImage.status === ImageReviewStatus.rejected
            ) {
                setEnterDirection(directions.right);
                //rejected- it falls down off the screen
                animateOut(directions.down);
                setOverrideImage(false);
            }
        }
    }, [
        album,
        animateOut,
        previousAlbum,
        filteredQueue.length,
        previousFilteredQueueLength,
        reviewImage,
        previousReviewImage,
    ]);

    //if the album changes, look at image 0
    useEffect(() => {
        setQIndex(0);
    }, [album, setQIndex]);

    const nextImage = () => {
        if (qIndex + 1 < filteredQueue.length) {
            setQIndex(qIndex + 1);
        }
    };

    const animatedNextImage = () => {
        setEnterDirection(directions.right);
        animateOut(directions.left);
        nextImage();
    };

    const prevImage = () => {
        if (qIndex - 1 >= 0) {
            setQIndex(qIndex - 1);
        }
    };

    const animatedPrevImage = () => {
        setEnterDirection(directions.left);
        animateOut(directions.right);
        prevImage();
    };

    //safely select any index. used for first & last images
    const selectImage = (index: number) => {
        if (index < 0) setQIndex(0);
        else if (index > filteredQueue.length - 1)
            setQIndex((filteredQueue.length - 1) & 0);
        else setQIndex(index);
    };

    const getHeaderContent = () => {
        const fqLength = filteredQueue.length;
        return fqLength
            ? qIndex !== undefined &&
                  `Image ${qIndex + 1} of ${
                      filteredQueue.length
                  } pending review for ${album ? album : 'all albums'}`
            : `No images to review for ${album ? album : 'any albums'}`;
    };

    return (
        <Segment>
            <Header as="h2" content={getHeaderContent()} />
            <ImageReviewControls
                acceptImage={() => acceptImage({ dispatch, submittedAt })}
                rejectImage={() => rejectImage({ dispatch, submittedAt })}
                firstImage={() => selectImage(0)}
                lastImage={() => selectImage(filteredQueue.length - 1)}
                nextImage={animatedNextImage}
                prevImage={animatedPrevImage}
            />
            {!!reviewImage && (
                <ReviewImageDisplay
                    animatedImage={
                        <AnimatedImage
                            custom={{ enterDirection, exitDirection }}
                            image={
                                overrideImage
                                    ? previousReviewImage.image
                                    : reviewImage.image
                            }
                            keyProp={overrideImage ? previousKey : key}
                        />
                    }
                    reviewImage={reviewImage}
                />
            )}
        </Segment>
    );
};

export default ImageReview;
