module.exports = {
    v1
}

function v1(app) {
    const controller = require('../controller/result.controller.js');

    app.post('/api/v1/result/load', controller.load);
}
