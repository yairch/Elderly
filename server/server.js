// HTTPS=true;SSL_CRT_FILE=cert.pem;SSL_KEY_FILE=key.pem
const express = require('express');
const bodyParser = require('body-parser');
// const fs = require('fs');
// const http = require('http');
const cors = require('cors');
const notifications = require('./notifications');
const app = express();

const PORT = 3001;
app.use(bodyParser.json());

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000', //Ziv
    //origin: 'http://192.168.242.1:3000', //Nadav
    credentials: true
}
app.use(cors(corsOptions))

const user = require("./routers/user.js");
app.use("/user", user);

const responsible = require("./routers/responsible.js");
app.use("/responsible", responsible);

const admin = require("./routers/admin.js");
app.use("/admin", admin);

const volunteer = require("./routers/volunteer.js");
app.use("/volunteer", volunteer);

const elderly = require("./routers/elderly.js");
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
