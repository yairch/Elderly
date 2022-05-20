// HTTPS=true;SSL_CRT_FILE=cert.pem;SSL_KEY_FILE=key.pem
import express from 'express';
import bodyParser from 'body-parser';
// const http = require('http');
import cors, { CorsOptions } from 'cors';
import logger from 'morgan';
import path from 'path';
import user from './routers/user';
import responsible from './routers/responsible';
import admin from './routers/admin';
import volunteer from './routers/volunteer';
import elderly from './routers/elderly';


export const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());

const corsOptions: CorsOptions = {
    origin: '*', //Ziv
    //origin: 'http://192.168.242.1:3000', //Nadav
    credentials: true
}
app.use(cors(corsOptions))

app.use(
    express.static(path.join(__dirname, "../build"))
);

app.use("/user", user);

app.use("/responsible", responsible);

app.use("/admin", admin);

app.use("/volunteer", volunteer);

app.use("/elderly", elderly);

app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../build/index.html")
    );
  });
