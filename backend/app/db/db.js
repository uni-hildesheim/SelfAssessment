const config = require('./config');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

//mongoose.connection.on('error', console.error.bind(
//    console, 'MongoDB connection error: ')
//);
mongoose.connection.on('error', function (err) {
    if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
        // we handle this special case in connect() down below
        return;
    }
    logger.error('MongoDB error: ' + err);
});
mongoose.connection.on('connecting', function () {
    logger.info('MongoDB connecting');
});
mongoose.connection.once('connected', function () {
    logger.info('MongoDB connected successfully!');
});
mongoose.connection.on('disconnected', function() {
    logger.info('MongoDB disconnected');
});
mongoose.connection.on('reconnected', function () {
    logger.info('MongoDB reconnected');
});
mongoose.connection.on('reconnectFailed', function () {
    logger.info('MongoDB reconnecting failed');
});

// https://github.com/Automattic/mongoose/issues/5169#issuecomment-314983113
function connect(dbURL, options) {
    var connection = mongoose.connection;
    mongoose.connect(dbURL, options);

    connection.on('error', function (err) {
        // If first connect fails because mongod is down, try again later.
        // This is only needed for first connect, not for runtime reconnects.
        // See: https://github.com/Automattic/mongoose/issues/5169
        if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
            // Wait for a bit, then try to connect again
            setTimeout(function () {
                logger.info('MongoDB retrying first connect...');
                connection.openUri(dbURL, options).catch(() => {});
                // Why the empty catch?
                // Well, errors thrown by db.open() will also be passed to .on('error'),
                // so we can handle them there, no need to log anything in the catch here.
                // But we still need this empty catch to avoid unhandled rejections.
            }, 1000);
        } else {
            // Some other error occurred.  Log it.
            logger.error('MongoDB error: ' + err);
        }
    });

    connection.once('open', function () {
        logger.info('MongoDB connection established');
    });

    return connection;
}

module.exports = {
    // generic connection data
    config: config,
    connect: connect,

    // models
    Course: require('../core/course/course.model'),
    Frontend: require('../core/frontend/frontend.model'),
    User: require('../core/user/user.model'),
};
