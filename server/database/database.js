const postgres = require('pg');

const config = require('./../utils/config.json');
const logger = require('./../utils/logger');


const client = new postgres.Client({
    user: config.DB.USER,
    host: config.DB.HOST,
    database: config.DB.NAME,
    password: config.DB.PASSWORD,
    port: config.DB.PORT,
});

// Connect to the DB
client.connect()
    .then(() => {
        const logs = {"type" : "Connection to database", status : "OK", database : client.database, host : client.host, port : client.port};
        logger.info(logs)
    })
    .catch((err) => {
            console.log(err);
            logger.error(err);
        }
    );


module.exports = {
    /** Query the current time */
    queryTime: async () => {
        const result = await client.query('SELECT NOW() as now');
        return result.rows[0]
    },
    getLocations: async (type) => {
        const locationQuery = `
    SELECT ST_AsGeoJSON(geog), name, type, gid
    FROM locations
    WHERE UPPER(type) = UPPER($1);`;
        const result = await client.query(locationQuery, [ type ]);
        return result.rows
    },

    /** Query the kingdom boundaries */
    getKingdomBoundaries: async () => {
        const boundaryQuery = `
    SELECT ST_AsGeoJSON(geog), name, gid
    FROM kingdoms;`;
        const result = await client.query(boundaryQuery);
        return result.rows
    }
};