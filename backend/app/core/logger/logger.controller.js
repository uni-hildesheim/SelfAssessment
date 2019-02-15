const logger = require('../../utils/logger');

module.exports = {
    log
}

// log a message to all transports registered on the global logger
function log(req, res) {
    const level = req.body.level;
    let message = req.body.message;

    message = '[Frontend] ' + message;

    logger.log(level, message);
    res.status(200).send();
}
