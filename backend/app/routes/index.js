// this is just a proxy that loads the real routes from this directory

module.exports = function(app) {
    const pincodeRoutes = require('./pincode.route.js')(app);
}
