const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
    associatedPin: Number,
    log: Object,
    structure: Object
});

const JournalModel = mongoose.model('Journal', JournalSchema);

module.exports = JournalModel;
