"use strict";
// We use the request module to handle our requests.
const Req = require('request');
const querystring = require('querystring');
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

// Oauth is an object accessed by requestTokenPath AND requestTokenAccess
const oauth = {
	callback: process.env.BASE_URL + "/signin-with-twitter",
	consumer_key: CONSUMER_KEY,
	consumer_secret: CONSUMER_SECRET
};

let oauthToken = '';
let oauthTokenSecret = '';


// Get link for user to authenticate with, pass it into handlebars for login page button
const requestTokenPath = {
	path: '/login',
	method: 'GET',
	handler: (request, reply) => {
		const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
		Req.post({ url: requestTokenUrl, oauth: oauth }, (err, response, body) => {
			const reqData = querystring.parse(body);
			oauthToken = reqData.oauth_token;
			oauthTokenSecret = reqData.oauth_token_secret;
			const uri = 'https://api.twitter.com/oauth/authenticate' + '?' + querystring.stringify({ oauth_token: oauthToken });
			reply.view('login', { uri: uri });
		});
	}
};

// Get access token and put it in client's cookie in a JWT
const requestTokenAccess = {
	path: '/signin-with-twitter',
	method: 'GET',
	handler: (request, reply) => {
		// Prepare oauth  object and URL for request
		oauth.token = request.query.oauth_token;
		oauth.token_secret = oauthTokenSecret;
		oauth.verifier = request.query.oauth_verifier;
		const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
		Req.post({ url: accessTokenUrl, oauth: oauth }, (err, response, body) => {
			// make dataToSend object which will be used in requests
			const authenticatedData = querystring.parse(body);
			const dataToSend = {
				token: authenticatedData.oauth_token,
				token_secret: authenticatedData.oauth_token_secret,
				screen_name: authenticatedData.screen_name
			};
			// JWTify the object, redirect user to home page with token as cookie
			const jwtToken = jwt.sign(dataToSend, jwtSecret);
			reply.redirect('/').state('access_token', jwtToken);
		});
	}
};

// Get array of 50 tweet objects and return them in callback
const collectAndSendTweets = (dataToSend, callback) => {
	//create URL, include env variables in dataToSend object, make get request
	const apiURL = 'https://api.twitter.com/1.1/statuses/home_timeline.json' + '?' +
		querystring.stringify({ screen_name: dataToSend.screen_name, count: 50 });
	dataToSend.consumer_key = process.env.CONSUMER_KEY;
	dataToSend.consumer_secret = process.env.CONSUMER_SECRET;
	Req.get({ url: apiURL, oauth: dataToSend, json: true }, (err, response, body) => {
		// map tweets to get relevant values in mapTweets
		const mapTweets = body.map((tweet) => {
			return {
				id_str: tweet.id_str,
				text: tweet.text,
				created_at: tweet.created_at,
				screen_name: tweet.user.screen_name
			};
		});
		// return tweets in handlebars-ready format
		callback({ tweets: mapTweets });
	});
};

module.exports = {
	requestTokenPath: requestTokenPath,
	requestTokenAccess: requestTokenAccess,
	collectAndSendTweets: collectAndSendTweets
};
