const logger = require('../../utils/logger');
const error = require('../../shared/error');

module.exports = {
    log
}

/**
 * Express.js controller.
 * Log one or multiple lines to the backend logger.
 * HTTP 200 will be set on success, HTTP 400 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function log(req, res) {
    const level = req.body.level;
    let message = req.body.message;
    let messages = req.body.messages;
    let handled = false;

    if (typeof message === 'string') {
        message = '[Frontend] ' + message;
        logger.log(level, message);
        handled = true;
    }

    if (Array.isArray(messages)) {
        for (let line of messages) {
            if (typeof line !== 'string') {
                continue;
            }

            line = '[Frontend] ' + line;
            logger.log(level, line);
        }

        handled = true;
    }

    if (!handled) {
        // invalid request body
        res.status(400).json({ error: error.ServerError.E_INVAL });
        return;
    }

    res.status(200).send();
}
