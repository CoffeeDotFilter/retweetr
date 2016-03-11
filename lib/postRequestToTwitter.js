const Req = require('request');

module.exports = (request, reply, decodedDataToSend, requestType) => {
	// add consumer key and consumer secret to oauth object
	decodedDataToSend.consumer_key = process.env.CONSUMER_KEY;
	decodedDataToSend.consumer_secret = process.env.CONSUMER_SECRET;
	// grab tweet id from request; select correct URL depending on requestType
	const tweetId = request.query.id;
	const url = requestType === 'retweet' ?
		'https://api.twitter.com/1.1/statuses/retweet/' + tweetId + '.json' :
		'https://api.twitter.com/1.1/favorites/create.json?id=' + tweetId;
	Req.post({ url: url, oauth: decodedDataToSend }, (err, response, body) => {
		reply('Success');
	});
};
