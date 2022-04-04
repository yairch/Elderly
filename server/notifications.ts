import express from 'express';
// import { WebSocket, WebSocketServer } from 'ws';
const WebSocketServer = require('websocket').server;
const router = express.Router();

let clients: { [clientId: number] : any} = {};
let wws;

export const initWebSocketServer = (server: any) => {
	wws = new WebSocketServer({
		httpServer: server
	});

	wws.on('request', (request: { accept: (arg0: null, arg1: any) => any; origin: string; resourceURL: { query: { param: any; }; }; }) => {
		const connection = request.accept(null, request.origin);
		const clientId = (request.resourceURL.query.param);
		clients[clientId] = connection;
		console.log(new Date() +'- Received new connection from origin: ' + request.origin);
		console.log(clients);

		connection.on('close', ()=> {
			console.log('connection closed to '+ clientId);
			clients[clientId] = null ;
			console.log(clients);
		});

		connection.on('message', (message: string) => {
			console.log('Server received message: '+ message);
		})

	});
};

export const notifyElderly = (elderlyId:number, volunteerName:string, channel:string, meetingSubject:string) => {
	try {
		clients[elderlyId].send(JSON.stringify({
			//FIXME: change the fields according to types/meeting
			message: 'incoming call',
			volunteerName: volunteerName,
			channel: channel,
			meetingSubject: meetingSubject
		}));
	}
	catch (e) {
		console.log(e);
		// eslint-disable-next-line no-throw-literal
		throw {status: 400, message: 'המשתמש לא מחובר למערכת'};
	}
}

export default router;
