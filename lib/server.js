"use strict";

// modules
const Hapi = require('hapi');
const http = require('https');
const server = new Hapi.Server();
const Inert = require('inert');
const Vision = require('vision');
const env = require('env2')('./config.env');
const port = process.env.PORT || 4000;
const url = require('url');
const querystring = require('querystring');

// Routes
const Resources = require('./routes/resources.js');
const RequestTokenPath = require('./routes/requesttoken.js').requestTokenPath;
const RequestTokenAccess = require('./routes/requesttoken.js').requestTokenAccess;
const Home = require('./routes/home.js');
const Retweet = require('./routes/retweet.js');
const Favorite = require('./routes/favorite.js');


// Hapi plugins
const plugins = [
	Inert,
	Vision,
];

server.connection({
	port: port
});

server.register(plugins, (err) => {
	if (err) console.log(err);

	server.views(require('./viewsettings.js'));
	server.route([
		Home,
		Retweet,
		Favorite,
		RequestTokenPath,
		RequestTokenAccess,
		Resources,
	]);
});

server.start(err => {
	if (err) throw err;
	console.log('Server is running at : ' + server.info.uri);
});

module.exports = server;
