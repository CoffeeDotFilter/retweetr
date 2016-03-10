const checkCookies = require('../checkCookies.js');
const postRequestToTwitter = require('../postRequestToTwitter.js');
const Req = require('request');

// If cookie is present, post 'retweet' request to Twitter
module.exports = {
	path: '/retweet',
	method: 'GET',
	handler: (request, reply) => {
		checkCookies(request, reply, (decodedDataToSend) => {
			postRequestToTwitter(request, reply, decodedDataToSend, 'retweet');
		});
	}
};
