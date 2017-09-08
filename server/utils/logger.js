

const winston = require('winston');
const path = require('path');
const config = require('./config.json');

// Configure custom app-wide logger
module.exports = new winston.Logger({
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

