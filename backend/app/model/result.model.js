const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    associatedPin: Number,
    lastChanged: Date,
    /* 
     * checksum that is calculated once the result is 'frozen'
     * -- > generated once, immutable
     */
    checksum: String,
    tests: [{
        _id: false, // stop generating id for nested document object
        id: Object, // TODO: allow only a specific type once the spec is final
        score: Number,
        maxScore: Number,
        /* the options that were correctly selected by the user */
        correctOptions: [Number],
        /* the options that were wrongly selected by the user */
        wrongOptions: [Number]
    }]
});

const ResultModel = mongoose.model('Result', ResultSchema);

module.exports = ResultModel;
