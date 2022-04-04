import {server as WebSocketServer} from 'websocket'

export const clients = new Set();
let wws;

export const initWebSocketServer = (server) => {
	wws = new WebSocketServer({
		httpServer: server
	});

	wws.on('request', (request) => {
		const connection = request.accept(null, request.origin);
		let clientId = (request.resourceURL.query.param);
		clients[clientId] = connection;
		console.log(new Date() +'- Received new connection from origin: ' + request.origin);
		console.log(clients);

		connection.on('close', ()=> {
			console.log('connection closed to '+ clientId);
			clients[clientId] = null ;
			console.log(clients);
		});

		connection.on('message', (message) => {
			console.log('Server received message: '+ message);
		})

	});
};

export const notifyElderly = (elderlyId, volunteerName, channel, meetingSubject) => {
	try {
		clients[elderlyId].send(JSON.stringify({
			message: 'incoming call',
			volunteerName: volunteerName,
			channel: channel,
			meetingSubject: meetingSubject
		}));
	}
	catch (e) {
		console.log(e);
		throw {status: 400, message: 'המשתמש לא מחובר למערכת'};
	}
}

