"use strict";

// modules
const Hapi = require('hapi');
const http = require('https');
const server = new Hapi.Server();
const Inert = require('inert');
const Vision = require('vision');
const Bcrypt = require('bcrypt');
const auth = require('./auth.js');
const redisFunctions = require('./redisFunctions.js');
const env = require('env2')('./config.env');
const port = process.env.PORT || 4000;
const url = require ('url');
const querystring = require('querystring');

// Routes
const Login = require('./routes/login.js');

// Hapi plugins
const plugins = [
	Inert,
	Vision,
];
const makeRequest = (options, cb) => {
  let request = http.request(options, (response) => {
    let body = '';
    response.on('data',(chunk) => {
      body += chunk;
    });
    response.on ('end', () => {
      cb(null , body);
    });
  });
  request.on('error', (err) => {
    console.log('request to' + options.host + ' failed!');
    cb(err);
  });
  request.write(options.body);
  request.end();
};


server.connection({
	port: port
});




server.register(plugins, (err) => {
	if (err) console.log(err);

	// server.auth

	server.views(require('./viewSettings.js'));
	server.route([
    Login
	]);
});

server.start(err => {
	if (err) throw err;
	console.log('Server is running at : ' + server.info.uri);
});

module.exports = {
	init: server
};
