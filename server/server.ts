// HTTPS=true;SSL_CRT_FILE=cert.pem;SSL_KEY_FILE=key.pem
import express from 'express'
import bodyParser from 'body-parser';
// const fs = require('fs');
// const http = require('http');
import cors, { CorsOptions } from 'cors'
import * as notifications from './notifications'
import user from './routers/user'
import responsible from './routers/responsible'
import admin from './routers/admin'
import volunteer from './routers/volunteer'
import elderly from './routers/elderly'


const app = express();

const PORT = 3001;
app.use(bodyParser.json());

app.use(express.json());

const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', //Ziv
    //origin: 'http://192.168.242.1:3000', //Nadav
    credentials: true
}
app.use(cors(corsOptions))

app.use("/user", user);

app.use("/responsible", responsible);

app.use("/admin", admin);

app.use("/volunteer", volunteer);

app.use("/elderly", elderly);


const server = app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
});

notifications.initWebSocketServer(server);

// const options = {
//     key: fs.readFileSync('privateKey.key'),
//     cert: fs.readFileSync('certificate.crt')
// };
//
// https.createServer(options, app).listen(PORT, () => {
//     console.log(`listening at https://localhost:${PORT}`)
// });
