const overlord = require('./../../utils/overseer');

module.exports = {
    v1
}

function v1(app) {
    const controller = require('./logger.controller');

    // log a message to a logfile
    app.post('/api/v1/logger/log', overlord.wrapFunction(controller.log));
}
