var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	nstatic = require('node-static'),
 stringremote = '',
fields=[],
fetchedstring ='';


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
 console.log('new connection roomid: '+ data.room + ' ' +  data.usernamerem);

}
}); 


socket.on('chat', function (data) {
stringremote = data.testochat;
fetchedstring='';
fields.length = 0;
fields =  stringremote.split("/");

for (i=0;i<fields.length;i++) {
	if(i===0) {fetchedstring = fetchedstring + 'Status = ' +  	fields[i] + '<br />';}
	if(i===1) {fetchedstring = fetchedstring + 'Hours = ' +  	fields[i]+ '<br />';}
	if(i===2) {fetchedstring = fetchedstring + 'Customer = ' +  fields[i]+ '<br />';}
	if(i===3) {fetchedstring = fetchedstring + 'Event = ' +  	fields[i]+ '<br />';}
	if(i===4) {fetchedstring = fetchedstring + 'Data = ' +  	fields[i]+ '<br />';}
	if (i>4)  {fetchedstring = fetchedstring + 'Unknown field = ' +  	fields[i]+ '<br />';}
	};
fetchedstring =  '<span style="color:green">Fields parsed from server: ' + fields.length + '</span><br />' + fetchedstring;		

		socket.broadcast.to(data.room).emit('chatser',
		{									
		'testochat' :	fetchedstring,
		'id': data.id,
		'room' : data.room										
		});
		
		socket.emit('chatresponse', {
			'testochat' : fetchedstring,
			'room' :  data.room,
			'id': data.id
			});	
		
	});	

	
});