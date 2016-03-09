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
  callback: "http://localhost:4000/signin-with-twitter",
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET
};

let oauthToken = '';
let oauthTokenSecret = '';

// Runs before login page is loaded, gets a requestToken and sets it to the 
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
      reply.view('home', { uri: uri });
    });
  }
};

// After authorising on twitter, user comes to this endpoint: we grab the access token 
// from the request, and 
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
      
      collectAndSendTweets(authenticatedData, (viewData) => {

        const jwtToken = jwt.sign({
          token: authenticatedData.oauth_token,
          token_secret: authenticatedData.oauth_token_secret,
          twitter_handle: authenticatedData.screen_name
        }, jwtSecret);

        reply.view('logged-in', viewData).state('access_token', jwtToken);

      });

    });    
  }
};

// Runs with a callback from inside requestTokenAccess. 
const collectAndSendTweets = (authenticatedData, callback) => {

  const apiURL = 'https://api.twitter.com/1.1/statuses/home_timeline.json' + '?' + 
    querystring.stringify({screen_name: authenticatedData.screen_name, count: 10});

  const dataToSend = {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    token: authenticatedData.oauth_token,
    token_secret: authenticatedData.oauth_token_secret
  };

  Req.get({url: apiURL, oauth: dataToSend, json:true}, (err, response, body) => {
    
    const mapTweets = body.map((tweet) => {
      return {
        text: tweet.text,
        created_at: tweet.created_at,
        user: tweet.user.screen_name
      };
    });

    callback({
      username: authenticatedData.screen_name,
      tweets: mapTweets
    });
  });
};

module.exports = {
  requestTokenPath: requestTokenPath,
  requestTokenAccess: requestTokenAccess
};
