module.exports = {
    v1
}

function v1(app) {
    const controller = require('./user.controller');

    // create a new user in the DB
    app.get('/api/v1/user/create', controller.create);
}
