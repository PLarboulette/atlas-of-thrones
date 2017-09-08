
'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('express-cors');

const app = express();
const http = require('http').Server(app);
const api = require("./api/api");

const config = require('./utils/config.json');

app.set('port', config.APP.PORT || 3000);
app.use(session({ resave: true, saveUninitialized: true, secret: config.APP.SECRET }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));
app.use('/api', api);

app.use(cors({
    allowedOrigins: [
        config.CORS.URL
    ]
}));

http.listen(app.get('port'), function(){
    console.log("INFO = [Listening on port "+app.get('port')+"]");
});

