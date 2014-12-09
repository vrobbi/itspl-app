var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	nstatic = require('node-static'),
linecounter = 0;	
var urlimageroom = [];
//  url = require('url');  // for serving files
	

// This will make all the files in the current folder
// accessible from the web
var fileServer = new nstatic.Server('./');

	
// This is the port for our web server.
// you will need to go to http://localhost:3000 to see it
var port = process.env.PORT || 8080; // Cloud9 + Heroku || localhost
app.listen(port);

// If the URL of the socket server is opened in a browser


function handler (request, response) {
//if ((url.parse(request.url).query) !== null){
//console.log( url.parse(request.url).query);		
//}

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
//   socket.join('public');   
socket.on('setuproom', function (data) { 
 var myregexp = /^[0-9]+$/;
 	if (myregexp.test(data.room)=== true)   {
// socket.leave('public');
 socket.join(data.room);
 socket.nickname = data.usernamerem;
// console.log(data.imageBG);
 if (data.imageBG ===  ''){
var occorrenza ='';
	 var len = urlimageroom.length;
	 console.log(len);
	for (i=len; i!=0; i--) {
		// var lunghezzastringa = urlimageroom[i].length;
occorrenza = urlimageroom[i-1].lastIndexOf('_');		 
//socket.emit('setuproomser', data);
console.log(urlimageroom[i-1].substr(0,occorrenza));
if (data.room ===  urlimageroom[i-1].substr(occorrenza+1)){
socket.emit('setuproomser', {
			'room' :  data.room,
			'imageBG' : urlimageroom[i-1].substr(0,occorrenza)				
			});	
break;	
	}
	 }
//});	 
 }
     // console.log (Object.keys(io.sockets.manager.rooms));
 
var roster = io.sockets.clients(data.room);
var listautenti = '';
roster.forEach(function(client) {
listautenti =	listautenti +  client.nickname + '<br />';
}); 

//socket.emit('setuproomser', {
//			'room' :  data.room,
//				'inforoom' : 'YOUR ROOM NAME IS VALID,<br />NOW YOUR PRIVATE ROOM IS ' + data.room + '<br />'				
//			});
	}
	
	}); 

 

	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
		
	//	if (data.room !='' || data.room !='public') {
		
		socket.broadcast.to(data.room).emit('moving', data);
											
		if(data.drawing  && data.controlpencil){
			linecounter = linecounter +1;
	//	console.log(linecounter);	
			
			
		}
											
											
											
	    //	}  
	});
	
		socket.on('deletezone', function (data) {
	socket.broadcast.to(data.room).emit('deletezoneser', data);
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

socket.on('loadimage', function (data) {
//occorrenza = urlimageroom[i].lastIndexOf('_');		 
urlimageroom.push(data.imageBG + "_" + data.room);	
//        console.log(urlimageroom);     
if (urlimageroom.length > 50) { 
urlimageroom.shift();
}	

	
		// to everyone except the originating client.
	//	console.log(urlimageroom[0]);
	socket.broadcast.to(data.room).emit('loadimageser', data);
	});	

	
});