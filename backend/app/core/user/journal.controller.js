const db = require('../../db/db');
const logger = require('../../utils/logger');
const error = require('../../shared/error');

module.exports = {
    loadLog,
    loadStructure,
    saveLog,
    saveStructure
}

/**
 * Express.js controller.
 * Load the journal log for a given user (pin) and return it in the response object.
 * HTTP 200 will be set on success, HTTP 404 if the user or the journal do not exist,
 * HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function loadLog(req, res, next) {
    const bodyPin = Number.parseInt(req.body.pin);

    db.User.findOne({
        pin: bodyPin
    }).then(user => {
        if (!user) {
            logger.warn('No user for pin: ' + bodyPin);
            res.status(404).json({ error: error.ServerError.E_DBQUERY });
            return;
        }

        if (!user.journal) {
            logger.warn('No journal log for pin: ' + bodyPin);
            res.status(404).json({ error: error.ServerError.E_DBQUERY });
            return;
        }
        logger.info('Loaded journal log for pin: ' + bodyPin);
        res.status(200).json(user.journal.log);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}

/**
 * Express.js controller.
 * Load the journal structure for a given user (pin) and return it in the response object.
 * HTTP 200 will be set on success, HTTP 404 if the user or the journal do not exist,
 * HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function loadStructure(req, res, next) {
    const bodyPin = Number.parseInt(req.body.pin);

    db.User.findOne({
        pin: bodyPin
    }).then(user => {
        if (!user) {
            logger.warn('No user for pin: ' + bodyPin);
            res.status(404).json({ error: error.ServerError.E_DBQUERY });
            return;
        }

        if (!user.journal) {
            logger.warn('No journal structure for pin: ' + bodyPin);
            res.status(404).json({ error: error.ServerError.E_DBQUERY });
            return;
        }
        logger.info('Loaded journal structure for pin: ' + bodyPin);
        res.status(200).json(user.journal.structure);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}

/**
 * Express.js controller.
 * Save the journal log for a given user (pin).
 * HTTP 200 will be set on success, HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function saveLog(req, res, next) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.User.updateOne({ pin: bodyPin }, {
        'journal.lastUpdate': new Date(),
        'journal.log': req.body.log
    }, { upsert: false }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Updated journal log for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}

/**
 * Express.js controller.
 * Save the journal log for a given user (pin).
 * HTTP 200 will be set on success, HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function saveStructure(req, res, next) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.User.updateOne({ pin: bodyPin }, {
        'journal.lastUpdate': new Date(),
        'journal.structure': req.body.structure
    }, { upsert: false }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Updated journal structure for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}
