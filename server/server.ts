import path from 'path';
import fs from 'fs';
import https from 'https';
import {app} from './app';
import * as notifications from './notifications';
import * as serverConfig from './constants/serverConfig';

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'fullchain.pem')),
}

const server = https.createServer(httpsOptions, app);
server.listen(serverConfig.port, () => {
    console.log(`listening production server at http://localhost:${serverConfig.port}`)
});

notifications.initWebSocketServer(server);
