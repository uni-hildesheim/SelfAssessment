module.exports = {
    v1
}

function v1(app) {
    const controller = require('./result.controller');

    app.post('/api/v1/result/load', controller.load);
    app.post('/api/v1/result/lock', controller.lock);
    app.post('/api/v1/result/update', controller.update);
}
