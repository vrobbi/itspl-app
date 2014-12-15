jQuery(function(){
	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}     	
jQuery("#divrubber").draggable({ cursor: "move" }).resizable();		
document.getElementById('divrubber').style.width="70px";
document.getElementById('divrubber').style.height="70px";
document.getElementById('size1').style.border="2px solid orange";
// document.getElementByClassName("sizepencil").style.border =""; 
	// The URL of your web server (the port is set in app.js)
	//var url = 'http://localhost:3000'
	var imageBG ='';
	var color ='';
	var username = '';
	var roomid = '';
	var pencilsize = 1;
	var positionx ='23';
	var positiony='0';
	var string64data = '';
	  var url = window.location.hostname;
	color = getParameterByName('color');
	if (color.length == 6){  color = '#' + color};
	
	username = getParameterByName('username');
	if (username.length > 1 && username.length < 25){  username = getParameterByName('username')};
	
	roomid = getParameterByName('roomID');
	if (roomid.length > 0){  roomid = getParameterByName('roomID')};	
	imageBG = getParameterByName('imageBG');
	
			
	var doc = jQuery(document),
		canvas = jQuery('#respondcanvas'),
		bgcanvas = jQuery('#bgcanvas');
//	instructions = jQuery('#instructions');
	var ctx = canvas[0].getContext('2d');	
	var ctx1 = bgcanvas[0].getContext('2d');	
	var drawing = false;
	var controlpencil = true;
	var controlrubber = false;
	var clients = {};
	var cursors = {};
	canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
	bgcanvas.width = document.body.clientWidth;
	bgcanvas.height = document.body.clientHeight;
	
var socket = io.connect(url); 

// var spessore = jQuery('#spessore').value;
var colorem;
 
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
 //   ctx.lineWidth =  2;
 ctx.font = "20px Tahoma";
 
 if (roomid.length > 0) {
socket.emit('setuproom',{
				'room': roomid,				
				'usernamerem' : username,
				'imageBG': imageBG
			});
} 

 if (imageBG.length > 3){ 
	imageobj = new Image();
	imageobj.src = imageBG;
	imageobj.onload = function() {
		ctx1.clearRect(0,0,bgcanvas.width,bgcanvas.height);
         ctx1.drawImage(imageobj, positionx, positiony);
	// loadImages(sources, function(images) {
									};
      
	 // alert(roomid);
	   socket.emit('loadimage',{
				'imageBG' : imageBG,
			    'usernamerem' : username,
				'room' : roomid				
			});
	
	};	

  
 $('#rubber').click(function(e) {
document.getElementById('rubber').style.border="2px solid orange";
document.getElementById('pencil').style.border="";
document.getElementById('divrubber').style.display="block";
controlrubber = true;
controlpencil = false;
    });	
 
 $('#pencil').click(function(e) {
document.getElementById('pencil').style.border="2px solid orange";
document.getElementById('rubber').style.border="";
controlrubber = false;
controlpencil = true;
document.getElementById('divrubber').style.display="none";
    });
 
  $('#size1').click(function(e) {
document.getElementById('size1').style.border="2px solid orange";
document.getElementById('size2').style.border="";
document.getElementById('size3').style.border="";
document.getElementById('size4').style.border="";
document.getElementById('size5').style.border="";
pencilsize = 1;
    });
  
    $('#size2').click(function(e) {
document.getElementById('size2').style.border="2px solid orange";
document.getElementById('size1').style.border="";
document.getElementById('size3').style.border="";
document.getElementById('size4').style.border="";
document.getElementById('size5').style.border="";
pencilsize = 2;
    });
	
	  $('#size3').click(function(e) {
document.getElementById('size3').style.border="2px solid orange";
document.getElementById('size2').style.border="";
document.getElementById('size1').style.border="";
document.getElementById('size4').style.border="";
document.getElementById('size5').style.border="";
pencilsize = 7;
    });
	  
	    $('#size4').click(function(e) {
document.getElementById('size4').style.border="2px solid orange";
document.getElementById('size2').style.border="";
document.getElementById('size3').style.border="";
document.getElementById('size1').style.border="";
document.getElementById('size5').style.border="";
pencilsize = 15;
    });
$('#size5').click(function(e) {
document.getElementById('size5').style.border="2px solid orange";
document.getElementById('size2').style.border="";
document.getElementById('size3').style.border="";
document.getElementById('size4').style.border="";
document.getElementById('size1').style.border="";
pencilsize = 25;
    });
 

 jQuery('#divrubber').dblclick(function (){
var divrubber = jQuery("#divrubber");
			var posizionerubber = divrubber.position();
			var rubberwidth =   document.getElementById('divrubber').style.width;
			var rubberheight = document.getElementById('divrubber').style.height;
ctx.clearRect(posizionerubber.left, posizionerubber.top, rubberwidth.substr(0,rubberwidth.length -2), rubberheight.substr(0,rubberheight.length -2));	

socket.emit('deletezone',{
				'x': posizionerubber.left,
				'y': posizionerubber.top,
				'width': rubberwidth.substr(0,rubberwidth.length -2),
				'height': rubberheight.substr(0,rubberheight.length -2),
			    'usernamerem' : username,
				'spessremo' : pencilsize,
				'room' : roomid				
			});
canvas2base64();
});

 
  socket.on('loadimageser', function (data) {
var imgdaclient = new Image();
//alert(data.imageBG); 
imgdaclient.src = data.imageBG;
ctx1.clearRect(0,0,bgcanvas.width,bgcanvas.height);
imgdaclient.onload = function() {
ctx1.drawImage(imgdaclient, positionx, positiony);
 }          
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
 
  socket.on('setupcanvasser', function (data) {
 var imgdaclient = new Image();
imgdaclient.src = data.canvasstring; 
imgdaclient.onload = function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(imgdaclient,0,0);          
}
	});	
 
  socket.on('deletezoneser', function (data) {
ctx.clearRect(data.x, data.y, data.width, data.height); 
   });	

	socket.on('moving', function (data) {
		if(!(data.id in clients)){
			// a new user has come online. create a cursor for them
			cursors[data.id] = jQuery('<div class="cursor"><div class="identif">'+ data.usernamerem +'</div>').appendTo('#cursors');
		}
	// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
			
		// Is the user drawing?
		if(data.drawing && data.controlpencil && clients[data.id]){
			
		 drawLinerem(clients[data.id].x, clients[data.id].y, data.x, data.y,data.spessremo,data.colorem);
		}
		
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = jQuery.now();
	});

	var prev = {};

  	canvas.on('mousedown', function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
	
	});
/*	
	$('#respondcanvas').on('mouseup mouseleave', function(){
 		drawing = false;
		 
	});
*/	
	$('#respondcanvas').on('mouseup', function() { 
drawing = false;
canvas2base64();
});

	var lastEmit = jQuery.now();

	doc.on('mousemove', function(e){
								 
		if(jQuery.now() - lastEmit > 25){
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
				'controlpencil': controlpencil,
			    'usernamerem' : username,
				'spessremo' : pencilsize,
				'room' : roomid,
				'colorem': color
			});
			lastEmit = jQuery.now();
		}
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing && controlpencil){
     	drawLine(prev.x, prev.y, e.pageX, e.pageY, color);
			prev.x = e.pageX;
			prev.y = e.pageY;
			
		}
	});
	
	// Remove inactive clients after 10 seconds of inactivity
    setInterval(function(){
        var totalOnline = 0;
        for(var ident in clients){
            if(jQuery.now() - clients[ident].updated > 16000){

                // Last update was more than 10 seconds ago.
                // This user has probably closed the page

                cursors[ident].remove();
                delete clients[ident];
                delete cursors[ident];
            }
            else {
			 totalOnline++;			
        }}
  //      jQuery('#onlineCounter').html('Users connected: '+totalOnline);
    },16000);

	function drawLine(fromx, fromy, tox, toy, color){
		ctx.strokeStyle = color;
	   ctx.lineWidth = pencilsize;	
        ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	
	function drawLinerem(fromx, fromy, tox, toy,spessore,colorem){
		ctx.strokeStyle = colorem;
       ctx.lineWidth = spessore;	
        ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function canvas2base64()  {
	var string_canvas = canvas[0].toDataURL();
	if (string64data.length !=  string_canvas.length) {
string64data = string_canvas;	
socket.emit('base64data',{
				'base64data' : roomid + '_' + string64data
				   });
console.log ('Byte sent to server: ' + string_canvas.length);
	}	
}

});

	