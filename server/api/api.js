
'use strict';

// Imports
const router = require('express').Router()
;const Joi = require('joi');

const {logInfo, logError} = require('./../utils/logger');
const database = require('./../database/database');
const cache = require('./../database/redis');

router.use( async (req, res, next) => {
    try {
        const start = Date.now();
        await next();
        const responseTime = Date.now() - start;
        const logs = {method : req.method, status : res.statusCode, url : req.url, responseTime : `${responseTime} ms`,};
        logInfo(logs);
    } catch (error) {
        logError(error);
    }
});

router.get('/', cache.route(), async (req, res) => {
    res.send('API - Hello friend ! ');
});

router.get('/time', async (req, res) => {
    const result = await database.queryTime();
    res.send(result);
});

// Input validation for id parameter
router.param('id', (req, res, next, id) => {
    const schema = Joi.object().keys({id: Joi.number().min(0).max(1000).required()});
    const {error} = Joi.validate({ id: id }, schema);
    if (!error) {
        next();
    } else {
        const errorResponse = {
            id : id,
            message : `ID taken in parameter doesn't respect the conditions`,
            conditions : `Number between 0 and 1000, required field`
        };
        logError(errorResponse);
        res.status(403).send(errorResponse)
    }
});

router.param('type', (req, res, next, type) => {
    const schema = Joi.object().keys({type: Joi.string().valid(['castle', 'city', 'town', 'ruin', 'landmark', 'region']).required()});
    const {error} = Joi.validate({ type: type }, schema);
    if (!error) {
        next();
    } else {
        const errorResponse = {
            type : type,
            message : `type taken in parameter doesn't respect the conditions`,
            conditions : `Authorised values : 'castle', 'city', 'town', 'ruin', 'landmark', 'region'`
        };
        logError(errorResponse);
        res.status(403).send(errorResponse)
    }
});

router.get('/locations/:type',  cache.route(), async (req, res) => {

    try {
        const type = req.params.type;
        const results = await database.getLocations(type);
        const locations = results.map((row) => {
            let geojson = JSON.parse(row.st_asgeojson);
            geojson.properties = { name: row.name, type: row.type, id: row.gid };
            return geojson
        });
        const logs = {method : req.method, status : res.statusCode, url : req.url, locationsLength : locations.length,};
        logInfo(logs);
        res.send(locations)
    } catch (error) {
        logError(error);
        res.status(500).send(error);
    }
});

router.get('/kingdoms',  cache.route(), async (req, res) => {
    try {
        const results = await database.getKingdomBoundaries();
        const boundaries = results.map((row) => {
            let geojson = JSON.parse(row.st_asgeojson);
            geojson.properties = { name: row.name, id: row.gid };
            return geojson
        });
        const logs = {method : req.method, status : res.statusCode, url : req.url, boundariesArrayLength : boundaries.length,};
        logInfo(logs);
        res.send(boundaries)
    } catch (error) {
        logError(error);
        res.status(500).send(error);
    }
});

router.get('/kingdoms/:id/size',  cache.route(), async (req, res) => {
    try {
        const id = req.params.id;
        const result = await database.getRegionSize(id);
        const sqKm = result.size * (10 ** -6);
        const json = {id : id, size : sqKm};
        const logs = {method : req.method, status : res.statusCode, url : req.url, id : id, kingDomSize : result};
        logInfo(logs);
        res.send(json);
    } catch (error) {
        logError(error);
        res.status(500).send(error);
    }
});

router.get('/kingdoms/:id/castles',  cache.route(), async (req, res) => {
    try {
        const result = await database.countCastles(id);
        const logs = {method : req.method, status : res.statusCode, url : req.url, id : id, kingDomSize : result};
        logInfo(logs);
        res.send(result);
    } catch (error) {
        logError(error);
        res.status(500).send(error);
    }
});

router.get('/kingdoms/:id/summary', cache.route(), async (req, res) => {
    try {
        const id = req.params.id;
        const result = await database.getSummary('kingdoms', id);
        const logs = {method : req.method, status : res.statusCode, url : req.url, id : id, summary : result};
        logInfo(logs);
        res.send(result);
    } catch (error) {
        logError(error);
        res.status(500).send(error);
    }
});

router.get('/locations/:id/summary', cache.route(), async (req, res) => {
    try {
        const id = req.params.id;
        const result = await database.getSummary('locations', id);
        const logs = {method : req.method, status : res.statusCode, url : req.url, id : id, summary : result};
        logInfo(logs);
        res.send(result);
    } catch (error) {
        logError(error);
        res.status(500).send(error)
    }
});

module.exports = router;