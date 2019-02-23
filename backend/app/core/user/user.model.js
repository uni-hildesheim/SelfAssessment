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

/**
 * Generate a validation code for the document instance.
 *
 * @param {String} schema schema containing a number or valid tokens
 */
UserSchema.methods.generateValidationCode = function(schema) {
    let code = schema;
    // tokens that need to be parsed and handled individually
    const metaTokens = ['%', '(', ')'];
    // tokens which can be replaced
    const replaceTokens = ['[0-9]', '[A-Z]', '[a-z]'];
    // valid characters for token replacement
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // replace the tokens
    for (const token of replaceTokens) {
        while (code.includes(token)) {
            let replacement = '';

            if (token === '[0-9]') {
                replacement = Math.floor(Math.random() * 10);
            } else if (token === '[A-Z]') {
                const index = Math.floor(Math.random() * alphabet.length);
                replacement = alphabet.substring(index, index+1);
            } else if (token === '[a-z]') {
                const index = Math.floor(Math.random() * alphabet.length);
                replacement = alphabet.substring(index, index+1).toLowerCase();
            }

            // perform the actual replacement
            code = code.replace(token, () => { return replacement; });
        }
    }

    // scan for meta tokens and handle them
    for (const token of metaTokens) {
        while (code.includes(token)) {
            let tokenIndex = 0;
            for (let i = 0; i < code.length; i++) {
                if (token === code.substr(i, 1)) {
                    tokenIndex = i;
                    break;
                }
            }

            // handle token
            if ((token === '%') && (tokenIndex < code.length-1)) {
                // get the next element
                const modulo = code.substr(tokenIndex+1, tokenIndex+2);
                let number;
                do {
                    number = Math.floor(Math.random() * 10);
                } while (number % modulo !== 0);

                // replace token
                code = code.replace(token + modulo, () => { return number; });
            } else if (token === '(') {
                // TODO: do something meaningful here
                code = code.replace(token, '');
            } else if (token === ')') {
                // TODO: do something meaningful here
                code = code.replace(token, '');
            }
        }
    }

    return code;
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
