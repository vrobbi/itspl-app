var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	nstatic = require('node-static'),
	url = require('url');  // for serving files
	

// This will make all the files in the current folder
// accessible from the web
var fileServer = new nstatic.Server('./');

	
// This is the port for our web server.
// you will need to go to http://localhost:3000 to see it
var port = process.env.PORT || 8080; // Cloud9 + Heroku || localhost
app.listen(port);

// If the URL of the socket server is opened in a browser
function handler (request, response) {
	if ((url.parse(request.url).query) !== null){
console.log( url.parse(request.url).query);		
}

request.addListener('end', function () {
    fileServer.serve(request, response);
    }).resume();
}

// Delete this row if you want to see debug messages
//io.set('log level', 1);

// Heroku doesn't support websockets so...
// Detect if heroku via config vars
// https://devcenter.heroku.com/articles/config-vars
// heroku config:add HEROKU=true --app node-drawing-game
if (process.env.HEROKU === 'true') {
    io.configure(function () {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 20);
    });
}


// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {
socket.join('public');   
/*
socket.on('setuproom', function (data) { 
 var myregexp = /^[a-zA-Z0-9]+$/;
 	if (myregexp.test(data.room)=== true)   {
socket.leave('public');
 socket.join(data.room);
 socket.nickname = data.usernamerem;
     // console.log (Object.keys(io.sockets.manager.rooms));
 
var roster = io.sockets.clients(data.room);
var listautenti = '';
roster.forEach(function(client) {
listautenti =	listautenti +  client.nickname + '<br />';
}); 

 */

	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
			
	//	if (data.room !='' || data.room !='public') {		
		socket.broadcast.to(data.room).emit('moving', data);
	    //	}  
	});
	

socket.on('doppioclick', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
	socket.broadcast.to(data.room).emit('doppioclickser', data);
				      
	});	


socket.on('fileperaltri', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
	socket.broadcast.to(data.room).emit('fileperaltriser', data);
	});	

	
});