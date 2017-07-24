'use strict';

var ready = require('document-ready');
// var visualizer = require('visualizer');
var socket = require('socket.io-client')('localhost:3000');

var drums = require('drums');

var app = {
	init() {

		drums.loadAllFiles();

		socket.on('connect', function () {
		    console.log('You are connected');
		});

		socket.on('newUser', function (data) {
		    console.log(data);
		});

		socket.on('buttonPress', function (data) {
		    // console.log(data);
		    drums.playSound(data);
		});
	}
};

ready(function () {
	app.init();
});
