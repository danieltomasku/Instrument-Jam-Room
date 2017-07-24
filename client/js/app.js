'use strict';

var ready = require('document-ready');
var socket = require('socket.io-client');

var app = {
	init() {
		socket.connect('localhost:3000');
	}
};

ready(function () {
	app.init();
});
