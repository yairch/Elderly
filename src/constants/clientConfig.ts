import path from 'path';
import dotenv from 'dotenv';

enum ENVIRONMENT_MODES {
    DEV='development',
    PROD='production'
};
console.log('REACT_APP_DEV_ENV', process.env.REACT_APP_DEV_ENV);
console.log('NODE_ENV', process.env.NODE_ENV)
export const DEV = (process.env.REACT_APP_DEV_ENV === ENVIRONMENT_MODES.DEV) || (process.env.NODE_ENV === ENVIRONMENT_MODES.DEV);
console.log('DEV', process.env.DEV)

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