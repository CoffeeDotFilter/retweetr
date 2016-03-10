const checkCookies = require('../checkCookies.js');
const Req = require('request');
const qs = require('querystring');

module.exports = {
	path: '/favorite',
	method: 'GET',
	handler: (request, reply) => {
		checkCookies(request, reply, (decodedDataToSend) => {
      // console.log('checked cookies');
			decodedDataToSend.consumer_key = process.env.CONSUMER_KEY;
			decodedDataToSend.consumer_secret = process.env.CONSUMER_SECRET;
			const tweetId = request.query.id;
      console.log(tweetId);
			// console.log(request.query);
			const url = 'https://api.twitter.com/1.1/favorites/create.json?id=' + tweetId;
			Req.post({ url: url, oauth: decodedDataToSend }, (err, response, body) => {
        console.log('made post request');
        console.log(body);
				reply('Success');
			});
		});
	}
};
