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
fetchedstring='';
fields.length = 0;


var stringremote = data.toString().replace(/ /g, '');


	
	
	
fields =  stringremote.split("/");


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
  })

  client.on('end', function() {
    clientList.splice(clientList.indexOf(client), 1)
  })
})



function searchstring (stringremote) {
var datastring =  stringremote.toString().replace(/ /g, '');
if (datastring.search('send=POWR') === 0) 
{
return (valore);	
	
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
