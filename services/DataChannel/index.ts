var redis = require('redis');

const subscribe = (callback: any) => {
    var subscriber = redis.createClient();

    subscriber.subscribe('liveupdates');

    subscriber.on('error', function (err: any) {
        console.log('Redis error: ' + err);
    });

    subscriber.on('message', callback);
};

const publish = (data: any) => {
    var publisher = redis.createClient();

    publisher.publish('liveupdates', data);
};

interface DataChannel {
    publish: any;
    subscribe: any;
}
export default {
    publish,
    subscribe,
} as DataChannel;
