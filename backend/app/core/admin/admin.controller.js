const crypto = require('crypto');

const db = require('../../db/db');
const logger = require('../../utils/logger');
const error = require('../../shared/error');

module.exports = {
    find,
    deleteMany
}

/**
 * Create a SHA512 hash adn compare it to process.env.ADMIN_SECRET_HASH.
 *
 * @param {string} secret Password string in plain text
 * @returns true if the hashes match, false otherwise
 */
function validateSecret(secret) {
    let secretSha512;

    if (!secret || typeof secret !== 'string') {
        return false;
    }

    secretSha512 = crypto.createHmac('sha512', secret);
    if (secretSha512.digest('hex') === process.env.ADMIN_SECRET_HASH) {
        return true;
    }

    return false;
}

/**
 * Express.js controller.
 * Find user objects in the database and return them in the response object.
 * HTTP 200 will be set on success, HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function find(req, res, next) {
    const query = req.body.query;
    const secret = req.body.secret;
    let result = [];

    // check whether the admin feature is enabled at all
    if (!process.env.ADMIN_ENABLE) {
        logger.warn('Admin feature requested, but disabled');
        res.status(403).send();
        return;
    }

    if (!validateSecret(secret)) {
        logger.warn('Admin secret validation failed');
        res.status(401).send();
        return;
    }

    logger.info('db.User.find(' + JSON.stringify(query) + ')');

    db.User.find(query).then(users => {
        for (const user of users) {
            result.push({
                pin: user.pin,
                created: user.created,
                journal: {
                    lastUpdate: user.journal.lastUpdate
                }
            })
        }
        res.status(200).json(result);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}

/**
 * Express.js controller.
 * Delete user objects from the database and return the number in the response object.
 * HTTP 200 will be set on success, HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function deleteMany(req, res, next) {
    const query = req.body.query;
    const secret = req.body.secret;

    // check whether the admin feature is enabled at all
    if (!process.env.ADMIN_ENABLE) {
        logger.warn('Admin feature requested, but disabled');
        res.status(403).send();
        return;
    }

    if (!validateSecret(secret)) {
        logger.warn('Admin secret validation failed');
        res.status(401).send();
        return;
    }

    logger.info('db.User.deleteMany(' + JSON.stringify(query) + ')');

    db.User.deleteMany(query).then(result => {
        res.status(200).json(result.n);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}
