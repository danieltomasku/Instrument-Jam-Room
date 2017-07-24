'use strict';

var ready = require('document-ready');
var visualizer = require('visualizer');
var socket = require('socket.io-client')('localhost:3000');

var drums = require('drums');
var synth = require('synth');
var bass = require('base');

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
		    drums.playSound(data);
		    // synth.playSound(data);
		    // bass.playSound(data);
		});
	}
};

ready(function () {
	app.init();
});
