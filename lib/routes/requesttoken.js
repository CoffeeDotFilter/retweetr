"use strict";
const Req = require('request');
const querystring = require('querystring');
const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const oauth = {
  callback: "http://localhost:4000/signin-with-twitter",
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET
};

let oauthToken = '';
let oauthTokenSecret = '';

const requestTokenPath = {
  path: '/login',
  method: 'GET',
  handler: (request, reply) => {
    Req.post({ url: requestTokenUrl, oauth: oauth}, (err, response, body) => {
      // Uncomment if there is no oauthToken.
      // console.log(body); 
      const reqData = querystring.parse(body);
      oauthToken = reqData.oauth_token;
      oauthTokenSecret = reqData.oauth_token_secret;
      const uri = 'https://api.twitter.com/oauth/authenticate' + '?' + querystring.stringify({ oauth_token: oauthToken});
      reply.view('home', { uri: uri });
    });
  }
};

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
      // console.log(authenticatedData, '<--------------- data from twitter');
      
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
    let tweets = [];
    for (let i in body) {
      let tweetObj = body[i];
      tweets.push({
        text: tweetObj.text,
        created_at: tweetObj.created_at,
        user: tweetObj.user.screen_name
      });
    }

    callback({
      username: authenticatedData.screen_name,
      tweets: tweets
    });
  });
};

module.exports = {
  requestTokenPath: requestTokenPath,
  requestTokenAccess: requestTokenAccess
};
