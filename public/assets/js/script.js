jQuery(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}     	
	
	// The URL of your web server (the port is set in app.js)
	//var url = 'http://localhost:3000';
	var filenoimage ='';
    var url = window.location.hostname;
	var stanza = '';
	if (location.href.indexOf('#')!= -1){
stanza  = location.href.substring(location.href.indexOf('#')+1);
 }
	
	var positionx ='23';
	var positiony='0';
	var positionleft;
		var positiontop;

	var doc = jQuery(document),
		canvas = jQuery('#area2draw'),
    //canvas1 = jQuery('#paper1'),
color = '#000000';
	// A flag for drawing activity
	var drawing = false;
	var clients = {};
	var cursors = {};
	
	//  funzione richiesta di nick name   
	
	var username = '';
				

if(!username)
{
	username = prompt("Hey there, insert your nick name, please", "");
}

username = username.substr(0,20);	
var socket = io.connect(url); 

var ctx = canvas[0].getContext('2d');	
//var ctx1 = canvas1[0].getContext('2d');	
var spessore = jQuery('#spessore').value;
var colorem;
    // Force canvas to dynamically change its size to the same width/height
    // as the browser window.
 //   canvas[0].width = document.body.clientWidth;
//    canvas[0].height = document.body.clientHeight;
//alert(canvas[0].width);
    // ctx setup
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth =  2;
 ctx.font = "20px Tahoma";

	// Generate an unique ID
	var id = Math.round(jQuery.now()*Math.random());
if (username =='')  {username = id }
//url.substring(url.indexOf('#')+1);

if (stanza.length > 2) {
socket.emit('setuproom',{
				'room': stanza,				
				'id': id,
				'usernamerem' : username
			});
} else {
socket.emit('setuproom',{
				'room': 'public',				
				'id': id,
				'usernamerem' : username
			});      
}

socket.on('setuproomserKO', function (data) {
stanza = data.room;	
document.getElementById('audiocall').disabled = false;
document.getElementById('videocall').disabled = false;
alert	(data.inforoom); 	
});
 
  socket.on('setuproomser', function (data) {
stanza = data.room;	
 jQuery('<div class="testochatser"><span>FROM SERVER:</span> '+ data.inforoom + data.listautenti +'</div>').appendTo('#testichat');
// document.getElementById('frecce').style.backgroundColor ='#ffff00';
 });


jQuery('#scrivi').keypress(function(e){
var code = e.keyCode;
if (code == '13') {
  if (document.getElementById('scrivi').value.length > 0 ) {	
 
 socket.emit('chat',{
				'testochat': document.getElementById('scrivi').value,				
				'id': id,
				'usernamerem' : username,
				'room' : stanza
			});
 jQuery('<div class="testochat"><span>ME:</span> ' + document.getElementById('scrivi').value +'</div>').appendTo('#testichat');
  document.getElementById('scrivi').value ='';

var objDiv = document.getElementById("testichat");
objDiv.scrollTop = objDiv.scrollHeight;

}}
});

$('#file-input').change(function(e) {
        var file = e.target.files[0],
            imageType = /image.*/;
			console.log (file.type);
		var reader = new FileReader();
			  
    if (!file.type.match(imageType)) { 
	filenoimage =  file.name;
	console.log (file.type);
//	  var fileURL = (window.URL || window.webkitURL).createObjectURL(file);  
      //     reader.onload = SaveToDisk(fileURL,file.name);
		
//      	reader.readAsDataURL(file); 	
 console.log(file);
	//	var vendorURL = window.URL || window.webkitURL;
//	  video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
 socket.emit('fileperaltri',{
				'id': id,
				'positionx': positionx,
				'positiony': positiony,
				'fileperaltri':  this.src,
				'room': stanza,
				'filenoimage' : filenoimage
				});		
	} else {
		filenoimage ='';
       reader.onload = fileOnload;
 reader.readAsDataURL(file);  
		     
	}
filenoimage ='';	
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

*/

jQuery('#vedomonitor').click(function (){
if(document.getElementById('monitorcam').style.display == 'none')   { 
document.getElementById("monitorcam").style.display = 'block';
document.getElementById('vedomonitor').innerHTML = ' Hide webcam monitor ';
} else  {
document.getElementById('monitorcam').style.display = 'none';	
document.getElementById('vedomonitor').innerHTML = ' Show webcam monitor ';
}										  
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
jQuery('#salvafoto').click(function (){
var dataURL = canvas[0].toDataURL();
document.getElementById("canvasimg").src = dataURL;  
window.open(document.getElementById("canvasimg").src, "toDataURL() image", "width=1000, height=1000");									
										  
});

 jQuery('#cancellalavagna').click(function (){
ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);													  
});
 

  
  jQuery('#suonacamp').click(function (){

socket.emit('suonacamp',{
				'id': id,
				'room' : stanza
			});

});  
 
 
 socket.on('fileperaltriser', function (data) {
 if (data.filenoimage =='') {
var imgdaclient = new Image();
imgdaclient.src = data.fileperaltri;
//    alert(data.fileperaltri);
imgdaclient.onload = function() {
//	imgdaclient.src = data.fileperaltri;
ctx.drawImage(imgdaclient, data.positionx, data.positiony);
console.log('IMMAGINE');	
}
} else {
console.log(data.filenoimage);	 
var blob = new Blob([data.filenoimage], {type: 'application/octet-binary'});
var fileURL = (window.URL || window.webkitURL).createObjectURL(blob);  
var reader = new FileReader();
 
reader.onload = SaveToDisk(data.filenoimage,unknown);
	// reader.readAsDataURL(blob); 
}
});	
	
 socket.on('doppioclickser', function (data) {
 ctx.fillStyle = data.color;
 ctx.font = data.fontsizerem + "px Tahoma";
  ctx.fillText(data.scrivi, data.x, data.y); 
          
	});	
 
  socket.on('chatser', function (data) {
 
	//alert (data.testochat);
jQuery('<div class="testochat"><span>' + data.usernamerem +':</span> '+ data.testochat +'</div>').appendTo('#testichat');         
document.getElementById('frecce').style.backgroundColor ='#ffff00';
var objDiv1 = document.getElementById("testichat");
objDiv1.scrollTop = objDiv1.scrollHeight;
	});
  
  socket.on('suonacampser', function (data) {
 if (document.getElementById('faisuonare').checked) {
  //    var thissound=document.getElementById("audio1");
document.getElementById("audio1").play();												  
			 }	
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

            ctx.strokeStyle = data.color;
			drawLinerem(clients[data.id].x, clients[data.id].y, data.x, data.y,data.spessremo,data.color);
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
		var offset =   canvas.offset();
		prev.x = e.pageX - offset.left;
		prev.y = e.pageY - offset.top;
	});
	
	canvas.bind('mouseup mouseleave', function(){
 
		drawing = false;
	});

	var lastEmit = jQuery.now();

	canvas.on('mousemove', function(e){
	  offset =   canvas.offset();	
	 positionleft =  e.pageX - offset.left;
	 positiontop = e.pageY- offset.top;
								 
	if(jQuery.now() - lastEmit > 30){
	
		 
		
	//	document.getElementById('risultato').innerHTML = $('#minicolore').minicolors('rgbaString');
	socket.emit('mousemove',{
				'x': positionleft,
				'y': positiontop,
				'drawing': drawing,
                'color': $('#minicolore').minicolors('rgbaString'),
				'id': id,
				'usernamerem' : username,
				'spessremo' : pencilsize,
				'room' : stanza
			});
			lastEmit = jQuery.now();
		}
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){
       //     ctx.strokeStyle = document.getElementById('minicolore').value;
	//  ctx.strokeStyle = "#ff0000";
			drawLine(prev.x, prev.y, positionleft, positiontop);
			prev.x = positionleft;
			prev.y = positiontop;
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
/*	
canvas.addEventListener("dragover", function (evt) {
evt.preventDefault();
}, false);


canvas.addEventListener("drop", function (evt) {
var files = evt.dataTransfer.files;
if (files.length > 0) {
var file = files[0];
if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
var reader = new FileReader();
// Note: addEventListener doesn't work in Google Chrome for this event
reader.onload = function (evt) {
img.src = evt.target.result;
};
reader.readAsDataURL(file);
}
}
evt.preventDefault();
}, false); 
*/
//// end setinterval function ****************************
	function drawLine(fromx, fromy, tox, toy){
	ctx.strokeStyle = $('#minicolore').minicolors('rgbaString');
       ctx.lineWidth = pencilsize;	
	   console.log(pencilsize);
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
				'room': stanza,
				'filenoimage' : ''
				});	
        });
    }
	

function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || 'unknown';

      var event = document.createEvent('Event');
       event.initEvent('click', true, true);
       save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}
	

	
(function() {
var idtempo;
  var streaming = false,
      video        = document.getElementById('video'),
  	paper1  = document.getElementById('paper1'),
      startbutton  = document.getElementById('catturacam'),
      width = 320,
      height = 240;

  navigator.getMedia = ( navigator.getUserMedia || 
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    { 
      video: true, 
      audio: false 
    },
    function(stream) {
      if (navigator.mozGetUserMedia) { 
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
		  video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
		        }
      video.play();
    },
    function(err) {
      console.log("An error occured! " + err);
    }
  );
/*
  video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', 320);
      video.setAttribute('height', 240);
//	  video.setAttribute('maxFrameRate',5);
 //     canvas.setAttribute('width', width);
   //   canvas.setAttribute('height', height);
      streaming = true;
    }
		  
  }, false);



 
  
  
document.getElementById('autocamabi').addEventListener('change', function(ev){
																		  
if (document.getElementById('autocamabi').checked) {	
document.getElementById('tempocam').disabled = true;
idtempo = setInterval(function() {
takepicture();	
},document.getElementById('tempocam').value);
}else{
clearInterval(idtempo);
document.getElementById('tempocam').disabled = false;
}   
  }, false);
*/
})();


});

	