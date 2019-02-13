// this is just a proxy that loads the real routes from this directory

module.exports = function(app) {
    require('./course.route').v1(app);
    require('./frontend.route').v1(app);
    require('./journal.route').v1(app);
    require('./logger.route').v1(app);
    require('./pincode.route').v1(app);
    require('./result.route').v1(app);
}
