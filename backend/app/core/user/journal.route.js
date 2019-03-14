const overlord = require('./../../utils/overseer');

module.exports = {
    v1
}

function v1(app) {
    const controller = require('./journal.controller');

    // raw journal object exchange
    app.post('/api/v1/journal/log/load', overlord.wrapFunction(controller.loadLog));
    app.post('/api/v1/journal/log/save', overlord.wrapFunction(controller.saveLog));
    app.post('/api/v1/journal/structure/load', overlord.wrapFunction(controller.loadStructure));
    app.post('/api/v1/journal/structure/save', overlord.wrapFunction(controller.saveStructure));
}
