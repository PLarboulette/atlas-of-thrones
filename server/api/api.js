
'use strict';

// Imports
const router = require('express').Router()
;const Joi = require('joi');

const logger = require('./../utils/logger');
const database = require('./../database/database');

router.use( async (req, res, next) => {
    try {
        const start = Date.now();
        await next();
        const responseTime = Date.now() - start;
        const logs = {method : req.method, status : res.statusCode, url : req.url, responseTime : `${responseTime} ms`,};
        // console.log(`Method : ${req.method} - Status : ${res.statusCode} - Url : ${req.url} - Response Time : ${responseTime} ms`);
        logger.info(logs);
    } catch (err) {
        logger.error(err);
        console.log(err);
    }

});

router.get('/', async (req, res) => {
    res.send('API - Hello friend ! ');
});

router.get('/time', async (req, res) => {
    const result = await database.queryTime();
    res.send(result);
});

// Input validation for id parameter
router.param('id', function(req, res, next, id) {
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
        logger.error(errorResponse);
        res.send(errorResponse)
    }
});

router.param('type', function(req, res, next, type) {
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
        logger.error(errorResponse);
        res.send(errorResponse)
    }
});

router.get('/locations/:type', async (req, res) => {

    try {
        const type = req.params.type;
        const results = await database.getLocations(type);
        const locations = results.map((row) => {
            let geojson = JSON.parse(row.st_asgeojson);
            geojson.properties = { name: row.name, type: row.type, id: row.gid };
            return geojson
        });
        const logs = {method : req.method, status : res.statusCode, url : req.url, locationsLength : locations.length,};
        logger.info(logs);
        res.send(locations)
    } catch (error) {
        logger.error(error);
        res.send(error);
    }

});

// Respond with boundary geojson for all kingdoms
router.get('/kingdoms', async (req, res) => {
    try {
        const results = await database.getKingdomBoundaries();
        const boundaries = results.map((row) => {
            let geojson = JSON.parse(row.st_asgeojson);
            geojson.properties = { name: row.name, id: row.gid };
            return geojson
        });
        const logs = {method : req.method, status : res.statusCode, url : req.url, boundariesArrayLength : boundaries.length,};
        logger.info(logs);
        res.send(boundaries)
    } catch (error) {
        logger.error(error);
        res.send(error);
    }
});


router.get('/kingdoms/:id/size', async (req, res) => {

    try {
        const id = req.params.id;
        const result = await database.getRegionSize(id);
        const sqKm = result.size * (10 ** -6);
        const json = {id : id, size : sqKm};
        const logs = {method : req.method, status : res.statusCode, url : req.url, id : id, kingDomSize : result};
        logger.info(logs);
        res.send(json);

    } catch (error) {
        logger.error(error);
        res.send(error);
    }
});

router.get('/kingdoms/:id/castles', async (req, res) => {

    try {
        const schema = Joi.object().keys({id: Joi.number().min(0).max(1000).required()});
        const id = req.params.id;
        const {error, value} = Joi.validate({ id: id }, schema);
        if (!error) {
            const result = await database.countCastles(id);
            const logs = {method : req.method, status : res.statusCode, url : req.url, id : id, kingDomSize : result};
            logger.info(logs);
            res.send(result);
        } else {
            res.send(error);
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;