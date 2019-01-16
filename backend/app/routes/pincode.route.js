module.exports = function(app) {
    const controller = require('../controller/pincode.controller.js');

    // request a new pseudo-random PIN code
    app.get('/api/misc/pincode/create', controller.create);
}
