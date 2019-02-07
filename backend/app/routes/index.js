// this is just a proxy that loads the real routes from this directory

module.exports = function(app) {
    require('./course.route.js').v1(app);
    require('./journal.route.js').v1(app);
    require('./logger.route.js').v1(app);
    require('./pincode.route.js').v1(app);
}
