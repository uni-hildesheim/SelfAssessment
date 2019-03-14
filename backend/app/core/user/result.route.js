const overlord = require('./../../utils/overseer');

module.exports = {
    v1
}

function v1(app) {
    const controller = require('./result.controller');

    app.post('/api/v1/result/load', overlord.wrapFunction(controller.load));
    app.post('/api/v1/result/lock', overlord.wrapFunction(controller.lock));
    app.post('/api/v1/result/update', overlord.wrapFunction(controller.update));
}
