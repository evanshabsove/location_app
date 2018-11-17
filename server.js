// including libraries
var http = require('http');
var static = require('node-static');
var app = http.createServer(handler);
var io = require('socket.io').listen(app);
pry = require('pryjs')

// define port
var port = 8080;

// make html, js & css files accessible
var files = new static.Server('./public');

// serve files on request
function handler(request, response) {
	request.addListener('end', function() {
		files.serve(request, response);
	}).resume();
}

// listen for incoming connections from client
const userIds = {}
io.sockets.on('connection', function (socket) {
  // start listening for coords
  socket.on('send:coords', function (data) {
    userIds[socket] = data.id
  	// broadcast your coordinates to everyone except you
  	socket.broadcast.emit('load:coords', data);
  });

  socket.on('disconnect', function() {
    let userId = userIds[socket]
    console.log(userId);
    socket.broadcast.emit('user:disconnect', userId)
  })
});

// starts app on specified port
app.listen(port);
console.log('Your server goes on localhost:' + port);
