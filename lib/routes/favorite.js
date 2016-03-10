const checkCookies = require('../checkCookies.js');
const postRequestToTwitter = require('../postRequestToTwitter.js');
const Req = require('request');

// If cookie is present, post 'favourite' request to Twitter
module.exports = {
	path: '/favorite',
	method: 'GET',
	handler: (request, reply) => {
		checkCookies(request, reply, (decodedDataToSend) => {
			postRequestToTwitter(request, reply, decodedDataToSend, 'favorite');
		});
	}
};
