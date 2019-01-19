const config = require('./config.js');
const mongoose = require('mongoose');

//mongoose.connection.on('error', console.error.bind(
//    console, 'MongoDB connection error: ')
//);
mongoose.connection.on('error', function (err) {
    if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
        // we handle this special case in connect() down below
        return;
    }
    console.log('MongoDB error: ' + err);
});
mongoose.connection.on('connecting', function () {
    console.log('MongoDB connecting');
});
mongoose.connection.once('connected', function () {
    console.log('MongoDB connected successfully!');
});
mongoose.connection.on('disconnected', function() {
    console.log('MongoDB disconnected');
});
mongoose.connection.on('reconnected', function () {
    console.log('MongoDB reconnected');
});
mongoose.connection.on('reconnectFailed', function () {
    console.error('MongoDB reconnecting failed');
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
            //console.log(new Date(), String(err));

            // Wait for a bit, then try to connect again
            setTimeout(function () {
                console.log("Retrying first connect...");
                connection.openUri(dbURL, options).catch(() => {});
                // Why the empty catch?
                // Well, errors thrown by db.open() will also be passed to .on('error'),
                // so we can handle them there, no need to log anything in the catch here.
                // But we still need this empty catch to avoid unhandled rejections.
            }, 1000);
        } else {
            // Some other error occurred.  Log it.
            console.error(new Date(), String(err));
        }
    });

    connection.once('open', function () {
        console.log("Connection to db established.");
    });

    return connection;
}

module.exports = {
    // generic connection data
    config: config,
    connect: connect,

    // models
    Journal: require('../model/journal.model.js'),
    Pincode: require('../model/pincode.model.js')
};
