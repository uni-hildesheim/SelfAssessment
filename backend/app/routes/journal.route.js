module.exports = {
    v1
}

function v1(app) {
    const controller = require('../controller/journal.controller.js');

    // backwards compatibility
    app.post('/api/v1/journal/save', controller.save);

    // raw journal object exchange
    app.post('/api/v1/journal/load', controller.load);
    app.post('/api/v1/journal/log/save', controller.saveLog);
    app.post('/api/v1/journal/structure/save', controller.saveStructure);
}
