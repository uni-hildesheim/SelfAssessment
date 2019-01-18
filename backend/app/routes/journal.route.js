module.exports = function(app) {
    const controller = require('../controller/journal.controller.js');

    // raw journal object exchange
    app.post('/api/misc/journal/load', controller.load);
    app.post('/api/misc/journal/save', controller.save);
}
