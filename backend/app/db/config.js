module.exports = {
    uri: 'mongodb://localhost:27017/selfassessment',
    options: {
        //user: 'test',
        //pass: 'test',
        useNewUrlParser: true,
        poolSize: 10, // Maintain up to 10 socket connections
        bufferMaxEntries: 0, // Return errors immediately rather than waiting for reconnect
        connectTimeoutMS: 0, // Never give up initial connection
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
    }
};
