module.exports = {
    v1
}

function v1(app) {
    const controller = require('../controller/journal.controller.js');

    // raw journal object exchange
    app.post('/api/v1/journal/load', controller.load);
    app.post('/api/v1/journal/save', controller.save);
}
