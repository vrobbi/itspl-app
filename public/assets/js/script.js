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
	var textdrawing ='';
	if (location.href.indexOf('#')!= -1){
stanza  = location.href.substring(location.href.indexOf('#')+1);
 }
    var controlimg = true;
	var positionx ='23';
	var positiony='0';
	var positionleft;
	var positiontop;
	
	var doc = jQuery(document),
		canvas = jQuery('#area2draw'),
    //canvas1 = jQuery('#paper1'),
color = '#000000';
	// A flag for drawing activity
	var  offset =   canvas.offset();	
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
  
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth =  2;
	ctx.textBaseline = "bottom";
 ctx.font = "14px Arial";

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

});
 

jQuery('#writetext').keyup(function(e){
var code = e.keyCode;
	
if (document.getElementById('writetext').value.length > 0 ) {	
 
 document.getElementById('divtext').style.display="block";
 document.getElementById('divtext').style.fontSize = selfontsize + "px";
 document.getElementById('divtext').style.fontFamily = selfontype;
 document.getElementById('divtext').style.color = $('#minicolore').minicolors('rgbaString');
 document.getElementById("divtext").innerHTML = document.getElementById('writetext').value;
 controltext = true;

  if (code == '13') {
	  textdrawing = document.getElementById('writetext').value;
  document.getElementById('writetext').value ='';
 text('textopen');
}   }
});

$('#file-image').change(function(e) {
        var file = e.target.files[0],
            imageType = /image.*/;
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
		 reader.onload = (function(e) {
		    var img = $('<img>', { src: e.target.result });
	      img.load(function() {
           ctx.drawImage(this, positionx, positiony);
			document.getElementById('file-image').value="";
		//	document.getElementById('divtext').style.display="block";
		//  	controltext =true;
	//	$('#imgloading').attr('src',e.target.result).width('auto').height('auto'); // setting ur image here
		//	$(img).attr('src', e.target.result).css('max-width', img.width+'px');
		//	alert(img.src.width   + '      '   + img.src.height);
			socket.emit('fileperaltri',{
				'id': id,
				'positionx': positionx,
				'positiony': positiony,
				'fileperaltri':  this.src,
				'room': stanza,
				'filenoimage' : ''
				});	
        });
		  });	   
 reader.readAsDataURL(file);  
}
filenoimage ='';	
	});	

jQuery('#area2draw').dblclick(function (e){
positionx = e.pageX - offset.left;
positiony= e.pageY - offset.top;
//console.log(offset.top);
if (controltext &&  textdrawing.length > 0) {
ctx.fillStyle = $('#minicolore').minicolors('rgbaString');
ctx.font =  selfontsize +"px " + selfontype;
ctx.fillText(document.getElementById('divtext').innerHTML, positionx, positiony); 

socket.emit('doppioclick',{
				'x': positionx,
				'y': positiony,
				'scrivi': textdrawing,				
				'color': $('#minicolore').minicolors('rgbaString'),
				'id': id,
			'fontsizerem': selfontsize +'px ' + selfontype,
				'room' : stanza
			});
textdrawing ="";
document.getElementById("divtext").innerHTML ="";
document.getElementById('divtext').style.display="none";
}	

if (controlimg === true) {
	
	
}
									
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
 ctx.font = data.fontsizerem;
  ctx.fillText(data.scrivi, data.x, data.y); 
          
	});	
 
  socket.on('chatser', function (data) {
 
	//alert (data.testochat);
jQuery('<div class="testochat"><span>' + data.usernamerem +':</span> '+ data.testochat +'</div>').appendTo('#testichat');         
document.getElementById('frecce').style.backgroundColor ='#ffff00';
var objDiv1 = document.getElementById("testichat");
objDiv1.scrollTop = objDiv1.scrollHeight;
	});
  

  
  socket.on('listautentiser', function (data) {
jQuery('<div class="testochatser"><span>FROM SERVER:</span> '+ data.listautenti +'</div>').appendTo('#testichat');
//document.getElementById('frecce').style.backgroundColor ='#ffff00'; 
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
		if(data.drawing && data.controlpencil && clients[data.id]){
			
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer

            ctx.strokeStyle = data.color;
			drawLinerem(clients[data.id].x, clients[data.id].y, data.x, data.y,data.spessremo,data.color);
		}
		
		if (data.controlrubber && data.drawing) {		
		ctx.clearRect(data.x-data.width-6, data.y, data.width, data.height); 			 
		 }
		
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = jQuery.now();
	});

	var prev = {};

      
	canvas.on('mousedown', function(e){
		e.preventDefault();
		jQuery("#cursors .cursor").css( "zIndex", 6);
		jQuery("#divrubber").css( "zIndex", 6);
		jQuery("#divtext").css( "zIndex", 11);
		drawing = true;
		 offset =   canvas.offset();
		prev.x = e.pageX - offset.left;
		prev.y = e.pageY - offset.top;
	});
	
canvas.bind('mouseup mouseleave', function(){
 drawing = false;
 jQuery("#cursors .cursor").css( "zIndex", 10);
 jQuery("#divrubber").css( "zIndex", 11);
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
				'controlrubber': controlrubber,
				'controlpencil': controlpencil,
				'width': rubbersize,
				'height': rubbersize,
				'spessremo' : pencilsize,
				'room' : stanza
			});
			lastEmit = jQuery.now();
		}
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if (controltext){
jQuery("#divtext").css( "zIndex", 6);			
document.getElementById('divtext').style.left = (positionleft +1) +'px';
document.getElementById('divtext').style.top = (positiontop-document.getElementById('divtext').offsetHeight+1) +'px';	
 } 
		
		if (controlrubber){
document.getElementById('divrubber').style.left = (positionleft - rubbersize-6) +'px';
document.getElementById('divrubber').style.top = positiontop +'px';
			  if (drawing) {
	ctx.clearRect(positionleft - rubbersize-6, positiontop, rubbersize, rubbersize);
		}
			 } 
		
		if(drawing  && (!controlrubber  && !controltext)){
    	drawLine(prev.x, prev.y, positionleft, positiontop);
			prev.x = positionleft;
			prev.y = positiontop;
		}
	});
	
	// Remove inactive clients after 10 seconds of inactivity
    setInterval(function(){
        var totalOnline = 0;
        for(var ident in clients){
            if(jQuery.now() - clients[ident].updated > 10000){

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
    },10000);
var	img = document.createElement("img");
img.addEventListener("load", function (e) {
									   
ctx.drawImage(img,positionx, positiony);
}, false);
var canvasdrop = document.getElementById("area2draw");
canvasdrop.addEventListener("dragover", function (evt) {
evt.preventDefault();
}, false);


canvasdrop.addEventListener("drop", function (evt) {
var files = evt.dataTransfer.files;
if (files.length > 0) {
var file = files[0];
if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
var reader = new FileReader();
// Note: addEventListener doesn't work in Google Chrome for this event
reader.onload = function (evt) {
img.src = evt.target.result;
socket.emit('fileperaltri',{
				'id': id,
				'positionx': positionx,
				'positiony': positiony,
				'fileperaltri':  img.src,
				'room': stanza,
				'filenoimage' : ''
				});	
};
reader.readAsDataURL(file);

}
}
evt.preventDefault();
}, false); 


  socket.on('setupcanvasser', function (data) {
 var imgdaclient = new Image();
 console.log(data.canvasstring);
imgdaclient.src = data.canvasstring; 
imgdaclient.onload = function() {
ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(imgdaclient,0,0);         
 string64data =  data.canvasstring;
}
	});	
$("#imagesave").click(function() {
canvas2base64();
	});	
  
  
  function canvas2base64()  {
var string_canvas = canvas[0].toDataURL();
var string64data  = string_canvas;	
socket.emit('base64data',{
				'base64data' : stanza + '_' + string64data
				   });
console.log ('Bytes sent to server: ' + string_canvas.length);
	
 }


//// end setinterval function ****************************
	function drawLine(fromx, fromy, tox, toy){
	 ctx.strokeStyle = $('#minicolore').minicolors('rgbaString');
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

});

	