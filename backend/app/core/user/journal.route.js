module.exports = {
    v1
}

function v1(app) {
    const controller = require('./journal.controller');

    // raw journal object exchange
    app.post('/api/v1/journal/log/load', controller.loadLog);
    app.post('/api/v1/journal/log/save', controller.saveLog);
    app.post('/api/v1/journal/structure/load', controller.loadStructure);
    app.post('/api/v1/journal/structure/save', controller.saveStructure);
}
