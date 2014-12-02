jQuery(function(){
	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}     	
jQuery("#divrubber").draggable({ cursor: "move" }).resizable();		
document.getElementById('divrubber').style.width="70px";
document.getElementById('divrubber').style.height="70px";
	// The URL of your web server (the port is set in app.js)
	//var url = 'http://localhost:3000'
	var color ='';
	var username = '';
	var roomid = '';
    var url = window.location.hostname;
	color = getParameterByName('color');
	if (color.length == 6){  color = '#' + color};
	
	username = getParameterByName('username');
	if (username.length > 1 && username.length < 20){  username = getParameterByName('username')};
	
	roomid = getParameterByName('roomID');
	if (roomid.length > 0){  roomid = getParameterByName('roomID')};	
	
	
	var positionx ='23';
	var positiony='0';

	var doc = jQuery(document),
		canvas = jQuery('#respondcanvas'),
		canvas1 = jQuery('#paper1'),
	instructions = jQuery('#instructions');
	// A flag for drawing activity
	var drawing = false;
	var clients = {};
	var cursors = {};
	
	//  funzione richiesta di nick name   
	

//  username = username.substr(0,30);	
var socket = io.connect(url); 

var ctx = canvas[0].getContext('2d');	
var spessore = jQuery('#spessore').value;
var colorem;
    // Force canvas to dynamically change its size to the same width/height
    // as the browser window.
    canvas[0].width = document.body.clientWidth;
    canvas[0].height = document.body.clientHeight;

    // ctx setup
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth =  2;
 ctx.font = "20px Tahoma";

	// Generate an unique ID
//url.substring(url.indexOf('#')+1);

if (roomid.length > 0 ) {
socket.emit('setuproom',{
				'room': roomid,				
				'usernamerem' : username
			});
}

socket.on('setuproomserKO', function (data) {
stanza = data.room;	
alert	(data.inforoom); 	
});
 
  socket.on('setuproomser', function (data) {
stanza = data.room;	
 alert('<div class="testochatser"><span>FROM SERVER: </span> '+ data.inforoom + data.listautenti +'</div>');
// document.getElementById('frecce').style.backgroundColor ='#ffff00';
 
	});


$('#file-input').change(function(e) {
        var file = e.target.files[0],
            imageType = /image.*/;
    if (!file.type.match(imageType))
            return;

        var reader = new FileReader();
        reader.onload = fileOnload;
    reader.readAsDataURL(file);  
		     
    });	

/*
jQuery('#salvasulserver').click(function (){
var dataserver = canvas[0].toDataURL();

socket.emit('salvasulserver',{
				'id': id,
				'dataserver': dataserver,
				'orario':  jQuery.now()
			});										  
});




jQuery('#paper').dblclick(function (e){
positionx = e.pageX;
positiony= e.pageY;
if (document.getElementById('scrivi').value.length > 1 ) {
ctx.fillStyle = $('#minicolore').minicolors('rgbaString');
ctx.font =  document.getElementById('fontsize').value +"px Tahoma";
ctx.fillText(document.getElementById('scrivi').value, e.pageX, e.pageY); 

socket.emit('doppioclick',{
				'x': e.pageX,
				'y': e.pageY,
				'scrivi': document.getElementById('scrivi').value,				
				'color': $('#minicolore').minicolors('rgbaString'),
				'id': id,
				'spessremo' : document.getElementById('spessore').value,
				'fontsizerem': document.getElementById('fontsize').value,
				'room' : stanza
			});

document.getElementById('scrivi').value ='';
}	
									
});	
*/



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
				'spessremo' : document.getElementById('spessore').value,
				'room' : roomid				
			});
});
 
 
 
 socket.on('fileperaltriser', function (data) {
 
var imgdaclient = new Image();
imgdaclient.src = data.fileperaltri;
imgdaclient.onload = function() {
//	imgdaclient.src = data.fileperaltri;
ctx.drawImage(imgdaclient, data.positionx, data.positiony);
}
});	
	
 socket.on('doppioclickser', function (data) {
 ctx.fillStyle = data.color;
 ctx.font = data.fontsizerem + "px Tahoma";
	ctx.fillText(data.scrivi, data.x, data.y); 
          
	});	
 
  socket.on('deletezoneser', function (data) {
ctx.clearRect(data.x, data.y, data.width, data.height); 
   });	
 

  
  socket.on('listautentiser', function (data) {
jQuery('<div class="testochatser"><span>FROM SERVER:</span> '+ data.listautenti +'</div>').appendTo('#testichat');
document.getElementById('frecce').style.backgroundColor ='#ffff00'; 
		});
 	
	socket.on('moving', function (data) {
		
		if(! (data.id in clients)){
			// a new user has come online. create a cursor for them
			cursors[data.id] = jQuery('<div class="cursor"><div class="identif">'+ data.usernamerem +'</div>').appendTo('#cursors');
		}
	// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
			
		// Is the user drawing?
		if(data.drawing && clients[data.id]){
			
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer

         //   ctx.strokeStyle = data.colorem;
			drawLinerem(clients[data.id].x, clients[data.id].y, data.x, data.y,data.spessremo,data.colorem);
		}
		
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = jQuery.now();
	});

	var prev = {};

    // To manage touch events
    // http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/

  //  document.addEventListener("touchstart", touchHandler, true);
  
// document.addEventListener("blur", cambiacolore(), true);
		  
   document.addEventListener("change", cambiaspessore, true);
  function cambiaspessore () {
	   ctx.lineWidth = document.getElementById('spessore').value;	   
}  
      
	canvas.on('mousedown', function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
		
		// Hide the instructions
		instructions.fadeOut();
	});
	
	doc.bind('mouseup mouseleave', function(){
 
		drawing = false;
	});

	var lastEmit = jQuery.now();

	doc.on('mousemove', function(e){
								 
		if(jQuery.now() - lastEmit > 30){
			
//	document.getElementById('risultato').innerHTML = $('#minicolore').minicolors('rgbaString');
			
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
			    'usernamerem' : username,
				'spessremo' : document.getElementById('spessore').value,
				'room' : roomid,
				'colorem': color
			});
			lastEmit = jQuery.now();
		}
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){

           
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
        jQuery('#onlineCounter').html('Users connected: '+totalOnline);
    },16000);
//// end setinterval function ****************************
	function drawLine(fromx, fromy, tox, toy, color){
		ctx.strokeStyle = color;
	   ctx.lineWidth = document.getElementById('spessore').value;	
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

function fileOnload(e) {
        var img = $('<img>', { src: e.target.result });
		// alert(img.src.value);
   //     var canvas1 = $('#paper')[0];
      //     var context1 = canvas1.getContext('2d');
        img.load(function() {
            ctx.drawImage(this, positionx, positiony);
			socket.emit('fileperaltri',{
				'id': id,
				'positionx': positionx,
				'positiony': positiony,
				'fileperaltri':  this.src,
				'room': stanza
				});	
        });
    }
	
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
	
(function() {

  var streaming = false,
      video        = document.getElementById('video'),
  	paper1  = document.getElementById('paper1'),
      startbutton  = document.getElementById('catturacam'),
      width = 320,
      height = 240;

 
   
})();

});

	