var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	nstatic = require('node-static'),
linecounter = 0;	
var urlimageroom =[];
var   data64 =[];
var len1 ='';
// This will make all the files in the current folder
// accessible from the web
var fileServer = new nstatic.Server('./');
// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
var port = process.env.PORT || 8080; // Cloud9 + Heroku || localhost
app.listen(port);

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
socket.on('setuproom', function (data) { 
 var myregexp = /^[0-9]+$/;
 	if (myregexp.test(data.room)=== true)   {
 socket.join(data.room);
 socket.nickname = data.usernamerem;
 if (data.imageBG ===  ''){
var occorrenza ='';
	 var len = urlimageroom.length;
	for (i=len; i!=0; i--) {
		// var lunghezzastringa = urlimageroom[i].length;
occorrenza = urlimageroom[i-1].lastIndexOf('_');		 
//socket.emit('setuproomser', data);
//    console.log(urlimageroom[i-1].substr(0,occorrenza));
if (data.room === urlimageroom[i-1].substr(occorrenza+1)){
socket.emit('setuproomser', {
			'room' :  data.room,
			'imageBG' : urlimageroom[i-1].substr(0,occorrenza)				
			});	
break;	
	}
	 }
 }
 
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
//socket.emit('setuproomser', data);
//console.log(urlimageroom[i-1].substr(0,occorrenza));
}

	//  }); 
 

	}
	}); 


socket.on('base64data', function (data) { 
var occorrenza64 ='';	
var insertion =false;
var occorrenza64 = data.base64data.indexOf('_');	
var extractroom =  data.base64data.substr(0,occorrenza64);
console.log(extractroom);
len1 = data64.length;
	// console.log(len);
	// console.log(data.base64data.length);
	
	
for (i=0; i<len1; i++) {
		// var lunghezzastringa = urlimageroom[i].length;
occorrenza64  = data64[i].indexOf('_'); 
if (data64[i].substr(0,occorrenza64) === extractroom ) {
data64[i] =  data.base64data;	
insertion = true;
break;
 }
//socket.emit('setuproomser', data);
//console.log(urlimageroom[i-1].substr(0,occorrenza));
}
if (insertion == false) {
data64.push(data.base64data);
console.log	(data64.length + ' nuovo inserimento') ;
}
	 
console.log	(data64.length + ' lunghezza arrai completo') ;
	}); 

 

	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
		
	socket.broadcast.to(data.room).emit('moving', data);
											
		if(data.drawing  && data.controlpencil){
			linecounter = linecounter +1;
				
		}
		
	});
	
		socket.on('deletezone', function (data) {
	socket.broadcast.to(data.room).emit('deletezoneser', data);
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