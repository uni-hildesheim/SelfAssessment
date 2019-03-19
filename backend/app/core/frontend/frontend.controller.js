const db = require('../../db/db');
const logger = require('../../utils/logger');
const error = require('../../shared/error');

module.exports = {
    resources
}

/**
 * Express.js controller.
 * Load resources for the frontend such as translated texts or image references from the database
 * and return them in the response object.
 * HTTP 200 will be set on success, HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
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
