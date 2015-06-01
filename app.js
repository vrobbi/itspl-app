
var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	nstatic = require('node-static'); // for serving files

// This will make all the files in the current folder
// accessible from the web
var fileServer = new nstatic.Server('./public');
var   data64 = [];	
var len1 =0;
// This is the port for our web server.
// you will need to go to http://localhost:3000 to see it
var port = process.env.PORT || 8080; // Cloud9 + Heroku || localhost
app.listen(port);

var stringafile ='';
var stringaip ='';
var stanza ='';

// If the URL of the socket server is opened in a browser
function handler (request, response) {
	request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}

// Delete this row if you want to see debug messages
io.set('log level', 1);

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


socket.on('disconnect', function () {
								  
console.log('disconnected');  });


 socket.on('setuproom', function (data) { 
 var myregexp = /^[a-zA-Z0-9]+$/;
 console.log(data.room); 
	if (myregexp.test(data.room)=== true)   {
socket.leave('public');
 socket.join(data.room);
 socket.nickname = data.usernamerem;
 // console.log(io.sockets.manager.rooms);
  console.log (Object.keys(io.sockets.manager.rooms));
/* 
var roster = io.sockets.clients(data.room);
var listautenti = '';
roster.forEach(function(client) {
listautenti =	listautenti +  client.nickname + '<br />';
}); 
*/
 for (n=0; n<len1; n++) {
		// var lunghezzastringa = urlimageroom[i].length;
var occorrenza640  = data64[n].indexOf('_'); 
if (data64[n].substr(0,occorrenza640) === data.room) {
socket.emit('setupcanvasser', {
			'room' :  data.room,
			'canvasstring' : data64[n].substr(occorrenza640+1)				
			});		
break;
 }
}

}  else {
//		socket.join('public');	

}
	});

	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
			
	//	if (data.room !='' || data.room !='public') {		
		socket.broadcast.to(data.room).emit('moving', data);
	    //	}  
	});
	

socket.on('base64data', function (data) { 
var occorrenza64 ='';	
var insertion =false;
var occorrenza64 = data.base64data.indexOf('_');	
var extractroom =  data.base64data.substr(0,occorrenza64);
len1 = data64.length;
	// console.log(len);
 	
for (i=0; i<len1; i++) {
occorrenza64  = data64[i].indexOf('_'); 
if (data64[i].substr(0,occorrenza64) === extractroom ) {
data64[i] =  data.base64data;	
insertion = true;
console.log('update arraycanvas ' + data64.length);
break;
 }

}
if (insertion == false) {
data64.push(data.base64data);
console.log	(data64.length + ' new insert') ;
}
}); 


socket.on('doppioclick', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
	socket.broadcast.to(data.room).emit('doppioclickser', data);
				      
	});	

socket.on('chat', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.to(data.room).emit('chatser', data);
	});	
socket.on('fileperaltri', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
	socket.broadcast.to(data.room).emit('fileperaltriser', data);
	});	

socket.on('camperaltri', function (data) {
	 socket.broadcast.to(data.room).emit('camperaltriser', data);		
	});	
	
});