// this is just a proxy that loads the real routes from this directory

module.exports = function(app) {
    require('./journal.route.js').v1(app);
    require('./pincode.route.js').v1(app);
}
