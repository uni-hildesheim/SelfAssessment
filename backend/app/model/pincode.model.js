const mongoose = require('mongoose');

const PincodeSchema = new mongoose.Schema({
    pin: Number,
    created: Date
});

const PincodeModel = mongoose.model('Pincode', PincodeSchema);

module.exports = PincodeModel;
