const checkCookies = require('../checkCookies.js');
const Req = require('request');
const qs = require('querystring');

module.exports = {
	path: '/retweet',
	method: 'GET',
	handler: (request, reply) => {
		checkCookies(request, reply, (decodedDataToSend) => {
      // console.log('checked cookies');
			decodedDataToSend.consumer_key = process.env.CONSUMER_KEY;
			decodedDataToSend.consumer_secret = process.env.CONSUMER_SECRET;
			const tweetId = request.query.tweet_id;
			// console.log(request.query, request.query.tweet_id);
			const url = 'https://api.twitter.com/1.1/statuses/retweet/' + tweetId + '.json';
			Req.post({ url: url, oauth: decodedDataToSend }, (err, response, body) => {
        console.log('made post request');
        console.log(body);
				reply('Success');
			});
		});
	}
};
