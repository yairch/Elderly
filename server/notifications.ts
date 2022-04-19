import { Server } from 'http';
import { ParsedUrlQuery } from 'querystring';
import {connection, Message, request, server as WebSocketServer} from 'websocket'

export const clients: {[clientId: string]: connection | null} = {};
let wws;

export const initWebSocketServer = (server: Server) => {
	wws = new WebSocketServer({
		httpServer: server
	});

	wws.on('request', (request: request) => {
		const connection = request.accept(null, request.origin);
		const url = request.resourceURL;
		console.log({url});
		const clientId = (request.resourceURL.query! as ParsedUrlQuery).id as string;
		console.log({clientId})
		clients[clientId] = connection;
		console.log(new Date() +'- Received new connection from origin: ' + request.origin);
		console.log({clients});

		connection.on('close', ()=> {
			console.log('connection closed to '+ clientId);
			clients[clientId] = null ;
			console.log(clients);
		});

		connection.on('message', (message: Message) => {
			console.log('Server received message: '+ message);
		})

	});
};

export const notifyElderly = (elderlyId: string, volunteerFirstName: string | undefined, volunteerLastName: string | undefined, channelName: string, subject: string) => {
	try {
		if(clients[elderlyId]){
			clients[elderlyId]!.send(JSON.stringify({
				//FIXME: change the fields according to types/meeting
				message: 'incoming call',
				volunteerFirstName,
				volunteerLastName,
				channelName,
				subject
			}));
		}
	}
	catch (e) {
		console.log(e);
		// eslint-disable-next-line no-throw-literal
		throw {status: 400, message: 'המשתמש לא מחובר למערכת'};
	}
}

