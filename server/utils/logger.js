
'use strict';

const winston = require('winston');
const path = require('path');
const config = require('./config.json');

const logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            name: config.LOGGER.INFO.NAME,
            filename: path.resolve(__dirname, `../${config.LOGGER.INFO.FILENAME}`),
            level: config.LOGGER.INFO.LEVEL
        }),
        new (winston.transports.File)({
            name: config.LOGGER.ERROR.NAME,
            filename: path.resolve(__dirname, `../${config.LOGGER.ERROR.FILENAME}`),
            level: config.LOGGER.ERROR.LEVEL
        })
    ]
});

module.exports.logInfo = (logs) =>  {
    logger.info(logs);
};

module.exports.logWarn = (logs) => {
    logger.warn(logs)
};

module.exports.logError = (logs) =>  {
    logger.error(logs);
};

