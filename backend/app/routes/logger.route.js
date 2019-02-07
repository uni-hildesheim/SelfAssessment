module.exports = {
    v1
}

function v1(app) {
    const controller = require('../controller/logger.controller.js');

    // log a message to a logfile
    app.post('/api/v1/logger/log', controller.log);
}
