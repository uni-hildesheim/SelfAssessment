const config = require('./config.js');
const mongoose = require('mongoose');

var db = {};
db.mongoose = mongoose;
db.config = config;

// add the models to the db structure
db.Pincode = require('../model/pincode.model.js')(mongoose);

module.exports = db;
