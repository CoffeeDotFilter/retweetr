"use strict";
const tape = require('tape');
const server = require('../lib/server.js');

tape('server exists', (t) => {
	const actual = Object.keys(server).length > 0;
	t.ok(actual, 'server exists');
	t.end();
});

tape('going to the homepage without a cookie gets a redirect status 302', (t) => {
	server.inject({ method: 'GET', url: '/' }, (response) => {
		let actual = response.statusCode;
		let expected = 302;
		t.equal(actual, expected, 'server redirects the client');
		t.end();
	});
});

tape('check that server loads the login page', (t) => {
	server.inject({ method: 'GET', url: '/login' }, (response) => {
		let actual = response.statusCode;
		let expected = 200;
		t.equal(actual, expected, 'Response "200" received from server');

		expected = response.payload.indexOf('Swipe left to get next tweet') > -1;
		t.ok(expected, 'login has instruction details for the user');
		t.end();
	});
});

tape('teardown', (t) => {
	server.stop();
	t.end();
});
