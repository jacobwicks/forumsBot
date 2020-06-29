import makePost from '../../MakePost';
import log from '../../log';
import { RespondToPostProps } from '../../../../types';
import getDeathToll from '../../FromOther/getCdcDeathToll';
import { sendLogEvent } from '../../../../services/Events';

const name = 'Death Toll';

const triggers = ['deathtoll', 'death toll'];

//posts the death toll from
//https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/cases-in-us.html
const postDeathToll = async ({ postId, threadId }: RespondToPostProps) => {
    sendLogEvent('posting death toll');

    const toll = await getDeathToll();

    if (toll && toll.cases && toll.deaths) {
        const { cases, deaths } = toll;

        //generate the postcontent string
        const content = `There have been ${deaths.total} total deaths, including ${deaths.new} newly reported.
There are ${cases.total} COVID 19 cases, including ${cases.new} newly reported.`;

        try {
            await makePost({
                content,
                postId,
                threadId,
            });
        } catch (err) {
            //if something goes wrong, then log it!
            log('postDeathToll failed', { postId, threadId }, err);
            sendLogEvent({ error: 'failed to post death toll' });
        }
    } else {
        log('postDeathToll failed - no toll received', {
            postId,
            threadId,
        });
    }
};

export { postDeathToll as action, name, triggers };
