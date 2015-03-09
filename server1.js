var net = require('net');
 stringremote = '',
fields=[],
fetchedstring ='';

var chatServer = net.createServer(),
    clientList = [];
	var receivedstring;

chatServer.on('connection', function(client) {
  client.name = client.remoteAddress + ':' + client.remotePort
  client.write('Connected to the node.js server\n\r');

  clientList.push(client)

  client.on('data', function(data) {
// stringremote = data;	
var results= searchstring(data, client);
fetchedstring='';
fields.length = 0;
/*	

var stringremote = data.toString().replace(/ /g, '');



	
	
var fields =  stringremote.split("/");


for (i=0;i<fields.length;i++) {
	if(i===0) {fetchedstring = fetchedstring + 'Status = ' +  	fields[i] + '\n\r';}
	if(i===1) {fetchedstring = fetchedstring + 'Hours = ' +  	fields[i]+ '\n\r';}
	if(i===2) {fetchedstring = fetchedstring + 'Customer = ' +  fields[i]+ '\n\r';}
	if(i===3) {fetchedstring = fetchedstring + 'Event = ' +  	fields[i]+ '\n\r';}
	if(i===4) {fetchedstring = fetchedstring + 'Data = ' +  	fields[i]+ '\n\r';}
	if (i>4)  {fetchedstring = fetchedstring + 'Unknown field = ' +  	fields[i]+ '\n\r';}
	};
	
fetchedstring =  'Fields parsed from server: ' + fields.length + ' \n\r\n\r' + fetchedstring;		

						 
							 
	console.log(fetchedstring);						 
    broadcast(fetchedstring, client)
*/	
  })

  client.on('end', function() {
    clientList.splice(clientList.indexOf(client), 1)
  })
})



function searchstring (stringremote, client) {
var parsedstring ='';	
var datastring =  stringremote.toString().replace(/ /g, '');
if (datastring.search('/') != -1) {
	
console.log('trovato barra');	

var fields =  datastring.split("/");


for (i=0;i<fields.length;i++) {
	if(i===0) {parsedstring = parsedstring + 'Status = ' +  	fields[i] + '\n\r';}
	if(i===1) {parsedstring = parsedstring + 'Hours = ' +  	fields[i]+ '\n\r';}
	if(i===2) {parsedstring = parsedstring + 'Customer = ' +  fields[i]+ '\n\r';}
	if(i===3) {parsedstring = parsedstring + 'Event = ' +  	fields[i]+ '\n\r';}
	if(i===4) {parsedstring = parsedstring + 'Data = ' +  	fields[i]+ '\n\r';}
	if (i>4)  {parsedstring = parsedstring + 'Unknown field = ' +  	fields[i]+ '\n\r';}
	};
	
parsedstring =  'Fields parsed from server: ' + fields.length + ' \n\r\n\r' + parsedstring;		

						 
							 
	console.log(parsedstring);						 
    broadcast(parsedstring, client)





return	
}else {



if (datastring.search('send=POWR') === 0) 
{
console.log('trovato POWR');	
	
return ;	
	
	}	
	
	
	if (datastring.search('SetTarget') === 0) 
{
	
	console.log('trovato TARGET');
return ;	
	
	}	
}	
}

function broadcast(message, client) {
  var cleanup = []
  for(var i=0;i<clientList.length;i+=1) {
    if(client !== clientList[i]) {

      if(clientList[i].writable) {
        clientList[i].write(message)
      } else {
        cleanup.push(clientList[i])
        clientList[i].destroy()
      }

    }
  }
  //Remove dead Nodes out of write loop to avoid trashing loop index 
  for(i=0;i<cleanup.length;i+=1) {
    clientList.splice(clientList.indexOf(cleanup[i]), 1)
  }
}

chatServer.listen(81)
