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
      const jwtData = {
        twitter_handle: authenticatedData.screen_name,
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        token: authenticatedData.oauth_token,
        token_secret: authenticatedData.oauth_token_secret
      };
      const jwtToken = jwt.sign(jwtData, jwtSecret);
      reply('logged-in').header('Content-type', 'text/html').header('Authorization', jwtToken);
    });
  }
};

module.exports = {
  requestTokenPath: requestTokenPath,
  requestTokenAccess: requestTokenAccess
};
