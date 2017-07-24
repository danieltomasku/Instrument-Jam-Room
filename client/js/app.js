'use strict';

var ready = require('document-ready');
var visualizer = require('visualizer');
var socket = require('socket.io-client')('localhost:3000');

var drums = require('drums');
var synth = require('synth');
var bass = require('bass');

var app = {
	instrument: 'drums',
	init() {

		window.addEventListener('click', this.selectInstrument);

		drums.loadAllFiles();

		socket.on('connect', function () {
		    console.log('You are connected');
		});

		socket.on('newUser', function (data) {
		    console.log(data);
		});

		socket.on('buttonPress', function (data) {

			switch (this.instrument) {
				case 'drums':
					drums.playSound(data);
					break;
				case 'bass':
					bass.playSound(data);
					break;
				case 'synth':
					synth.playSound(data);
					break;
				default:
					break;
			}

		});
	},

	selectInstrument(event) {
		event.preventDefault();
		console.log('Selected', event.target.dataset.instrument);
		this.instrument = event.target.dataset.instrument;
	}
};

ready(function () {
	app.init();
});
