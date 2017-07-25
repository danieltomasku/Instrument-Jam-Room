'use strict';

var ready = require('document-ready');
var visualizer = require('visualizer');
var socket = require('socket.io-client')('localhost:3000');

var drums = require('drums');
var synth = require('synth');
var bass = require('bass');

var app = {
	instrument: 'drums',
	button: document.querySelector('#instruments'),
	init() {

		this.button.addEventListener('click', this.selectInstrument.bind(this));

		drums.loadAllFiles();

		socket.on('connect', function () {
		    console.log('You are connected');
		});

		socket.on('newUser', function (data) {
		    console.log(data);
		});

		socket.on('buttonPress', (data) => {
			console.log('instrument', this.instrument);
			
			switch (this.instrument) {
				case 'drums':
					console.log('drums');
					drums.playSound(data);
					break;
				case 'bass':
					console.log('bass');
					bass.playSound(data);
					break;
				case 'synth':
					console.log('synth');
					synth.playSound(data);
					break;
				default:
					break;
			}

		}).bind(this);
	},

	selectInstrument(event) {
		// console.log(event.target.dataset.instrument);
		event.preventDefault();
		this.instrument = event.target.dataset.instrument;
	}
};

ready(function () {
	app.init();
});
