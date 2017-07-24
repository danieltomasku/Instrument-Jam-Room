'use strict';

var ready = require('document-ready');
var socket = require('socket.io-client')('localhost:3000');

var app = {
	init() {
		socket.on('connect', function () {
		    console.log('You are connected');
		});

		socket.on('newUser', function (data) {
		    console.log(data);
		});

		socket.on('buttonPress', function (data) {
		    console.log(data);
		});
	}
};

ready(function () {
	app.init();
});
