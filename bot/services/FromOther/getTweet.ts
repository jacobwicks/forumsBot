import fetch from 'node-fetch';
import { getApi } from '../../../services/Config';

const getFirstOriginalTweet = (tweets: any) =>
    //find the first tweet that ISN'T a retweet
    tweets.find((tweet: any) => !tweet.retweeted);

//gets the latest tweet from the requested screenName
const getTweet = async (screenName: string) => {
    try {
        //get the bearer token  from the stored api Keys
        const twitter = await getApi('twitter');
        const bearerToken = twitter?.bearerToken;

        const baseUrl =
            'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=';

        //twitter timeline doesn't differentiate between tweets & retweets
        //so if you want a tweet authored by the requested user, get a few of em
        //no guarantees
        const count = 10;

        //Post request url should look like this
        //https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=10
        const getUrl = `${baseUrl}${screenName}&count=${count}`;

        const options = {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        };

        const tweets = await (await fetch(getUrl, options)).json();

        if (Array.isArray(tweets)) {
            const tweet = getFirstOriginalTweet(tweets);

            //optional chaining
            const tweetId = tweet?.id_str;

            //generate postContent string by wrapping in bbCode [url] tags
            //[url]https://twitter.com/thedailybeast/status/1259956481702666241[/url]
            const postContent = `[url]https://twitter.com/${screenName}/status/${tweetId}[/url]`;

            return !!tweetId && postContent;
        }
        console.log(`tweets is not an array`, tweets);

        return false;
    } catch (err) {
        console.log(`couldn't get tweet ${screenName}`, err);
        return undefined;
    }
};

export default getTweet;
