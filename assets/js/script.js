jQuery(function(){
	// This demo depends on the canvas element
	// The URL of your web server (the port is set in app.js)
	//var url = 'http://localhost:3000'
/*	
	var s = 'john smith/123 Street/Apt 4';
var fields = s.split(/\//);
var name = fields[0];
var street = fields[1];
var fetchedstring ='';

for (i=0;i<fields.length;i++) {
fetchedstring =  fetchedstring + '   ' + 	fields[i];
	
	};
	console.log('Fields fetched: ' + fields.length + ' = ' + fetchedstring);
*/	
	var color ='';
	var username = '';
	var roomid = '';
	var id = Math.round(jQuery.now()*Math.random());	
	  var url = window.location.hostname;
		
	username = getParameterByName('username');
	if (username.length > 1 && username.length < 25){  username = getParameterByName('username')}
	else {
username = id;		
	};
	
	
	
	roomid = getParameterByName('roomID');
	if (roomid.length > 0){  roomid = getParameterByName('roomID')};	
	imageBG = getParameterByName('imageBG');
	
			
	var doc = jQuery(document);
	
		
var socket = io.connect(url); 
 
 if (roomid.length > 0) {
socket.emit('setuproom',{
				'room': roomid,				
				'usernamerem' : username				
			});
} 


	
	jQuery('#scrivi').keypress(function(e){
var code = e.keyCode;
if (code == '13') {
  if (document.getElementById('scrivi').value.length > 0 ) {	

 socket.emit('chat',{
				'testochat': document.getElementById('scrivi').value,				
				'id': id,
				'usernamerem' : username,
				'room' : roomid
			});

  document.getElementById('scrivi').value ='';

var objDiv = document.getElementById("testichat");
objDiv.scrollTop = objDiv.scrollHeight;

}}
});
	
	
	
 socket.on('setuproomser', function (data) {
 var imgdaclient = new Image();
//alert(data.imageBG); 
imgdaclient.src = data.imageBG;     //  url of the image
imgdaclient.onload = function() {
	ctx1.clearRect(0,0,bgcanvas.width,bgcanvas.height);
 ctx1.drawImage(imgdaclient, positionx, positiony);          
}
	});	
 
 socket.on('chatresponse', function (data) {
 
	//alert (data.testochat);
jQuery('<div class="testochat" style="color:red">'+ data.testochat +'</div>').appendTo('#testichat');         
var objDiv1 = document.getElementById("testichat");
objDiv1.scrollTop = objDiv1.scrollHeight;
	});	
 
  socket.on('chatser', function (data) {
 
	//alert (data.testochat);
jQuery('<div class="testochat" style="color:red">'+ data.testochat +'</div>').appendTo('#testichat');         
var objDiv1 = document.getElementById("testichat");
objDiv1.scrollTop = objDiv1.scrollHeight;
	});
 

	var lastEmit = jQuery.now();

//	doc.on('mousemove', function(e){
								 
	
	// Remove inactive clients after 10 seconds of inactivity
  
	
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



});

	