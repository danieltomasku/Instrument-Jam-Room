'use strict';

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = 3000;

app.use('/', express.static(__dirname + '/client'));

io.on('connection', function(){
	console.log('Socket connected');
});

app.get(['*'], function (req, res) {
  res.sendFile(path.resolve(__dirname + '/client', 'index.html'));
});

server.listen(port);
console.log(`server listining on port ${port}`);
