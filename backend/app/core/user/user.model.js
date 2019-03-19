const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    pin: Number,
    created: Date,
    journal: {
        lastUpdate: Date,
        log: {
            _id: false, // stop generating id for nested document object
            sets: [{
                _id: false, // stop generating id for nested document object
                maps: [{
                    _id: false, // stop generating id for nested document object
                    key: Object, // TODO: allow only a specific type once the spec is final
                    val: Array
                }]
            }]
        },
        structure: {
            _id: false, // stop generating id for nested document object
            course: String,
            language: String,
            sets: [{
                _id: false, // stop generating id for nested document object
                set: Object,
                tests: Array
            }]
        }
    },
    result: {
        /* 
        * validation code that is calculated at the end of the assessment procedure
        * -- > generated once, immutable
        */
        validationCode: String,
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
    }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
