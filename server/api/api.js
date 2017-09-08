
'use strict';

// Imports
const router = require('express').Router();
const logger = require('./../utils/logger');
const database = require('./../database/database');

router.use(  async (req, res, next) => {
    try {
        const start = Date.now();
        await next();
        const responseTime = Date.now() - start;
        const logs = {method : req.method, status : res.statusCode, url : req.url, responseTime : `${responseTime} ms`,};
        console.log(`Method : ${req.method} - Status : ${res.statusCode} - Url : ${req.url} - Response Time : ${responseTime} ms`);
        logger.info(logs);
    } catch (err) {
        logger.error(err);
        console.log(err);
    }

});

router.get('/', async (req, res) => {
    res.send('Home page');
});

router.get('/test', async (req, res) => {
    res.send('Test');
});

router.get('/time', async (req, res) => {
    const result = await database.queryTime();
    res.send(result);
});

router.get('/locations/:type', async (req, res) => {
    const type = req.params.type;
    const results = await database.getLocations(type);
    if (results.length === 0) {
        res.sendStatus(404)
    }
    // Add row metadata as geojson properties
    const locations = results.map((row) => {
        let geojson = JSON.parse(row.st_asgeojson);
        geojson.properties = { name: row.name, type: row.type, id: row.gid };
        return geojson
    });

    res.send(locations)
});

// Respond with boundary geojson for all kingdoms
router.get('/kingdoms', async (req, res) => {
    const results = await database.getKingdomBoundaries();
    if (results.length === 0) {
        res.sendStatus(404)
    }

    // Add row metadata as geojson properties
    const boundaries = results.map((row) => {
        let geojson = JSON.parse(row.st_asgeojson);
        geojson.properties = { name: row.name, id: row.gid };
        return geojson
    });

    res.send(boundaries)
});

module.exports = router;