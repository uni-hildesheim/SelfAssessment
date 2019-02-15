module.exports = {
    v1
}

function v1(app) {
    const controller = require('./frontend.controller');

    app.get('/api/v1/frontend/resources', controller.resources);
}
