'use strict';

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = 3000;

app.use('/', express.static(__dirname + '/client'));

// Button Server
var buttonSocket = require('socket.io-client')('http://10.0.0.145:3000/');

buttonSocket.on('connect', function() {
	console.log('connected to button socket');
});

buttonSocket.on('buttonUpdate', function(data) {
	if (data.id === 6) {
		console.log(data);
	}
});

buttonSocket.on('disconnect', function(){
	console.log('Button socket disconnected');
});

buttonSocket.on('connect_error', function (error) {
  console.log('Error', error);
});

io.on('connection', function(){
	console.log('User connected');
});

app.get(['*'], function (req, res) {
	// buttonSocket.open();
  	res.sendFile(path.resolve(__dirname + '/dist', 'index.html'));
});

server.listen(port);
console.log(`server listining on port ${port}`);
