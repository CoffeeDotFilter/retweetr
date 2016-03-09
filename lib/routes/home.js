const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const collectAndSendTweets = require('./requesttoken.js').collectAndSendTweets;

module.exports = {
    method: 'GET',
    path: '/',
    config: {
      handler:(request, reply) => {
        if (!request.state.access_token) {
          reply.redirect('/login');
        } else {
          const token = request.state.access_token;
          const decodedDataToSend = jwt.verify(token, jwtSecret);
          collectAndSendTweets(decodedDataToSend, (viewData) => {
            reply.view('logged-in', viewData);
          });
        }
      }
    }
};