const mongoose = require('mongoose');

const FrontendSchema = new mongoose.Schema({
    name: String,
    created: Date,
    configs: [Object]
});

const FrontendModel = mongoose.model('Frontend', FrontendSchema);

module.exports = FrontendModel;
