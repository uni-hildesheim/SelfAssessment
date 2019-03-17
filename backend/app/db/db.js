const config = require('./config');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const ConnectionState = {
    ERROR: 0,
    DISCONNECTED: 1,
    CONNECTED: 2
}

let GLOBAL_STATE = ConnectionState.DISCONNECTED;

mongoose.connection.on('error', function (err) {
    if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
        // we handle this special case in connect() down below
        return;
    }
    GLOBAL_STATE = ConnectionState.ERROR;
    logger.error('MongoDB error: ' + err);
});
mongoose.connection.once('connected', function () {
    GLOBAL_STATE = ConnectionState.CONNECTED;
    logger.info('MongoDB connected successfully!');
});
mongoose.connection.on('disconnected', function() {
    if (GLOBAL_STATE !== ConnectionState.DISCONNECTED) {
        GLOBAL_STATE = ConnectionState.DISCONNECTED;
        logger.info('MongoDB disconnected');
    }
});
mongoose.connection.on('reconnected', function () {
    GLOBAL_STATE = ConnectionState.CONNECTED;
    logger.info('MongoDB reconnected');
});

// https://github.com/Automattic/mongoose/issues/5169#issuecomment-314983113
function connect(dbURL, options) {
    var connection = mongoose.connection;

    mongoose.connect(dbURL, options);

    return new Promise((resolve, reject) => {
        const retryIntervalMS = 1000;
        let retryTimeElapsedMS = 0;

        connection.on('error', function (err) {
            // If first connect fails because mongod is down, try again later.
            // This is only needed for first connect, not for runtime reconnects.
            // See: https://github.com/Automattic/mongoose/issues/5169
            if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
                // if there's no more retry time available, bail out
                if (options.connectTimeoutMS > 0 && retryTimeElapsedMS > options.connectTimeoutMS) {
                    reject(err);
                    return;
                }

                // Wait for a bit, then try to connect again
                setTimeout(function () {
                    logger.info('MongoDB retrying first connect...');
                    connection.openUri(dbURL, options).catch(() => {});
                    // Why the empty catch?
                    // Well, errors thrown by db.open() will also be passed to .on('error'),
                    // so we can handle them there, no need to log anything in the catch here.
                    // But we still need this empty catch to avoid unhandled rejections.

                    retryTimeElapsedMS += retryIntervalMS;
                }, retryIntervalMS);
            } else {
                // Some other error occurred.
                reject(err);
                return;
            }
        });
    
        connection.once('connected', function () {
            resolve(connection);
        });
    });
}

module.exports = {
    // generic connection data
    config: config,
    connect: connect,

    // global connection state
    state: GLOBAL_STATE,

    // models
    Course: require('../core/course/course.model'),
    Frontend: require('../core/frontend/frontend.model'),
    User: require('../core/user/user.model'),
};
