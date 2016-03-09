const requestTokenUrl = 2


const requestToken = function() {

  return 'https://api.twitter.com/oauth/authenticate' + querystring.stringify({
    client_id: process.env.CONSUMER_KEY,
    redirect_uri: process.env.BASE_URL + '/welcome'
  });
};

module-exports ={

  Path:
  Method: POST /oauth/request_token HTTP/1.1
  User-Agent: themattharris' HTTP Client'
  Host: api.twitter.com
  Accept:
}
