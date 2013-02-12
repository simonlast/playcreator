
var storage = require('./persist');

var io;
var sockets = [];

storage.init();

var connect = function(socket){

	socket.on('getImage', function (msg) {
		console.log('message: ' + msg);
		socket.emit('message', msg);
	});
}


exports.init = function(cio){
	io = cio;
	io.sockets.on('connection', connect);
}