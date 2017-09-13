
'use strict';

const config = require('./../utils/config.json');
const {logInfo, logError} = require('./../utils/logger');

const cache = require('express-redis-cache')({
    host: config.REDIS.HOST, port: config.REDIS.PORT
});

cache.on('error', (error) => {
    logError(error);
    throw new Error('Cache error!');
});

cache.on('message', (message) => {
    logInfo(message)
});

module.exports = cache;


