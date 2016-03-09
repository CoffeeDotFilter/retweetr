const createTwitterRoute = function() {

  return 'https://api.twitter.com/oauth/authenticate' + querystring.stringify({
    client_id: process.env.CONSUMER_KEY,
    redirect_uri: process.env.BASE_URL + '/welcome'
  });


};


module.exports = {
  path: '/twitterLogin',
  method: 'GET',
  hadler: (request, reply) => {
    reply.redirect(createTwitterRoute());

  }

};
