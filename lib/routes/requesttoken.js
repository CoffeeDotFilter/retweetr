"use strict";
// We use the request module to handle our requests.
const Req = require('request');
const querystring = require('querystring');
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

// Oauth is a variable accessed by requestTokenPath AND requestTokenAccess
const oauth = {
  callback: process.env.BASE_URL + "/signin-with-twitter",
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET
};

let oauthToken = '';
let oauthTokenSecret = '';

// Run before login page is loaded, getting a requestToken and setting it to the
// URL of the link of the 'Login with Twitter' button on the login page. On
// clicking the button, the user is redirected to Twitter to authorise our app.
const requestTokenPath = {
  path: '/login',
  method: 'GET',
  handler: (request, reply) => {
    const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    Req.post({ url: requestTokenUrl, oauth: oauth}, (err, response, body) => {
      const reqData = querystring.parse(body);
      oauthToken = reqData.oauth_token;
      oauthTokenSecret = reqData.oauth_token_secret;
      const uri = 'https://api.twitter.com/oauth/authenticate' + '?' + querystring.stringify({ oauth_token: oauthToken});
      reply.view('login', { uri: uri });
    });
  }
};

// Grab the relevant parts of their request and make a final request to Twitter for
// the access key. (User is redirected to this endpoint after authorising on Twitter, then redirected to home)
const requestTokenAccess = {
  path: '/signin-with-twitter',
  method: 'GET',
  handler: (request, reply) => {
    const authReqData = request.query;
    oauth.token = authReqData.oauth_token;
    oauth.token_secret = oauthTokenSecret;
    oauth.verifier = authReqData.oauth_verifier;
    const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';

    Req.post({ url: accessTokenUrl, oauth: oauth }, (err, response, body) => {
      const authenticatedData = querystring.parse(body);
      const dataToSend = {
        token: authenticatedData.oauth_token,
        token_secret: authenticatedData.oauth_token_secret,
        screen_name: authenticatedData.screen_name
      };

      const jwtToken = jwt.sign(dataToSend, jwtSecret);
      reply.redirect('/').state('access_token', jwtToken);
    });
  }
};

// Add our env keys to dataToSend param, make a request for 10 tweets. Map the
// tweets to get relevant values and return object containing them in callback
const collectAndSendTweets = (dataToSend, callback) => {

  const apiURL = 'https://api.twitter.com/1.1/statuses/home_timeline.json' + '?' +
              querystring.stringify({screen_name: dataToSend.screen_name, count: 50});

  dataToSend.consumer_key = process.env.CONSUMER_KEY;
  dataToSend.consumer_secret = process.env.CONSUMER_SECRET;

  Req.get({url: apiURL, oauth: dataToSend, json:true}, (err, response, body) => {

    const mapTweets = body.map((tweet) => {
      return {
        id_str: tweet.id_str,
        text: tweet.text,
        created_at: tweet.created_at,
        screen_name: tweet.user.screen_name
      };
    });

    callback({
      username: dataToSend.screen_name,
      tweets: mapTweets
    });
  });
};

module.exports = {
  requestTokenPath: requestTokenPath,
  requestTokenAccess: requestTokenAccess,
  collectAndSendTweets: collectAndSendTweets
};
