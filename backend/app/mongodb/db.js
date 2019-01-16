const config = require('./config.js');
const mongoose = require('mongoose');
mongoose.connect(config.uri, config.options);

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('connected', function () {
    console.log('MongoDB connected successfully!');
});

const db = {};
db.mongoose = mongoose;

// add the models to the db structure
db.Pincode = require('../model/pincode.model.js')(mongoose);

module.exports = db;
