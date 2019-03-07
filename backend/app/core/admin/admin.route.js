module.exports = {
    v1
}

function v1(app) {
    const controller = require('./admin.controller');

    // list users
    app.post('/api/v1/admin/user/find', controller.find);
    // delete users
    app.post('/api/v1/admin/user/deleteMany', controller.deleteMany);
}
