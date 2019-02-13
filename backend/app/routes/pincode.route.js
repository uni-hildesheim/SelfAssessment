module.exports = {
    v1
}

function v1(app) {
    const controller = require('../controller/pincode.controller');

    // request a new pseudo-random PIN code
    app.get('/api/v1/pincode/create', controller.create);
}
