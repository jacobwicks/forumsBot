import React, { ReactElement } from 'react';
import { Grid } from 'semantic-ui-react';
import { ReviewImage as ReviewImageType } from '../../../../../../types/types';
import { getDate } from '../../services/GetDate';
import User from '../../../../../User';

const ReviewImage = ({
    animatedImage,
    reviewImage,
}: {
    animatedImage: ReactElement;
    reviewImage: ReviewImageType;
}) => (
    <div style={{ height: 600 }}>
        <Grid columns="2" divided>
            <Grid.Column width="2">
                <User {...reviewImage.submittedBy} />
            </Grid.Column>
            <Grid.Column>
                <p>{getDate(reviewImage.submittedAt)}</p>
                <p>{reviewImage.status}</p>
                <div
                    style={{
                        width: 300,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'left',
                    }}
                >
                    {animatedImage}
                </div>
            </Grid.Column>
        </Grid>
    </div>
);

export default ReviewImage;
