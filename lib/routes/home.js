const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const collectAndSendTweets = require('./requesttoken.js').collectAndSendTweets;
const checkCookies = require('../checkCookies.js');

// Check if cookie is present. If present, run collectAndSendTweets, passing decoded
// JWT as Data for the request. If cookie is not present, redirect to login page.
module.exports = {
	method: 'GET',
	path: '/',
	config: {
		handler: (request, reply) => {
			checkCookies(request, reply, (decodedDataToSend) => {
				collectAndSendTweets(decodedDataToSend, (viewData) => {
					reply.view('home', viewData);
				});
			});
			// reply.view('home');
		}
	}
};
