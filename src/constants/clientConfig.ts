import path from 'path';
import dotenv from 'dotenv';

enum ENVIRONMENT_MODES {
    DEV='development',
    PROD='production'
};

export const DEV = process.env.NODE_ENV === ENVIRONMENT_MODES.DEV;

if(DEV) {
    dotenv.config({path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`)});
} else {
    dotenv.config();
}

const serverPort = process.env.SERVER_PORT || (DEV ? 3001 : 443);

const serverOrigin = DEV ? 'http://localhost' : 'https://elderly.cs.bgu.ac.il';
export const serverURL = `${serverOrigin}:${serverPort}`;

const webSocketOrigin = DEV ? 'ws://localhost' : 'ws://elderly.cs.bgu.ac.il';
export const webSocketURL = `${webSocketOrigin}:${serverPort}`;

export const clientPort = process.env.CLIENT_PORT || 3000;