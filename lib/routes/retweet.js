const checkCookies = require('../checkCookies.js');
const Req = require('request');

module.exports = {
	path: '/retweet',
	method: 'GET',
	handler: (request, reply) => {
    // console.log('got to handler');
		checkCookies(request, reply, (decodedDataToSend) => {
      // console.log('checked cookies');
			decodedDataToSend.consumer_key = process.env.CONSUMER_KEY;
			decodedDataToSend.consumer_secret = process.env.CONSUMER_SECRET;
			const tweetId = request.params.tweet_id;
			const url = 'https://api.twitter.com/1.1/statuses/retweet/' + '707882544302333953' + '.json';
			Req.post({ url: url, oauth: decodedDataToSend }, (err, response, body) => {
        // console.log('made post request');
        // console.log(body);
				reply(body);
			});
		});
	}
};
