import path from 'path';
import fs from 'fs';
import https from 'https';
import {app} from './app';
import * as notifications from './notifications';

const PORT = 443;

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'fullchain.pem')),
}

const server = https.createServer(httpsOptions, app);
server.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
});

notifications.initWebSocketServer(server);
