const db = require('../../db/db');
const logger = require('../../utils/logger');
const error = require('../../shared/error');

module.exports = {
    resources
}

// fetch all resources necessary for the frontend (static texts, images) from the DB
function resources(req, res, next) {
    db.Frontend.find({
        // empty filter to get all objects
    }).then(resources => {
        if (!resources) {
            logger.warn('No frontend resource configs found, check your data setup');
            res.status(404).json({ error: error.ServerError.E_DBQUERY });
            return;
        }

        if (resources.length > 1) {
            logger.warn('More than one frontend config found, sending the first one');
        }

        logger.info('Loaded frontend config created on ' + resources[0].created);
        res.status(200).json(resources[0].configs);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}
