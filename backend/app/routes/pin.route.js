module.exports = function(app) {
    const controller = require('../controller/pin.controller.js');

    // request a new pseudo-random PIN code
    app.get('/api/misc/pin/create', controller.createPin);
}
