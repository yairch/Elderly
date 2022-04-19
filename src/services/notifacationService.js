import { w3cwebsocket as W3WebSocket } from 'websocket';
import { wssURL } from '../ClientUtils';
import * as Cookies from 'js-cookie';
import { usersFields } from '../constants/collections';

let webSocket=null;
let onMessage;

const getCurrentWebSocket = () => {
	if (webSocket) {
		console.log("ws not null")
		return webSocket;
	}

	console.log("ws is null, so init")
	webSocket = createWebSocket(Cookies.get(usersFields.username));
	return webSocket;
}

const closeWebSocket = () => {
	if (webSocket){
		webSocket.close();
	}
}

const setOnMessage = (func) => {
	onMessage = func;
}

const createWebSocket = (clientId) => {
	const ws = new W3WebSocket(`${wssURL}?id=${clientId}`);

	ws.onopen = () => {
		console.log('client websocket connected');
	};

	ws.onmessage = (message) => {
		console.log('client onmessage received '+ message.data);
		onMessage(JSON.parse(message.data));
	};

	ws.onclose = () => {
		console.log('client onclose');
		webSocket=null;
	};

	return ws;
};

export {
	getCurrentWebSocket,
	closeWebSocket,
	createWebSocket,
	setOnMessage
};