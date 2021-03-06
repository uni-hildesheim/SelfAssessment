const db = require('../../db/db');
const logger = require('../../utils/logger');
const error = require('../../shared/error');

module.exports = {
    create
}

// length of the pin code, where each element is a digit
// 8 --> 10*10*10*10*10*10*10*10 = 100.000.000 possibilities
let PINCODE_LENGTH = Number.parseInt(process.env.PINCODE_LENGTH);
if (isNaN(PINCODE_LENGTH)) {
    logger.warn('Failed to get PINCODE_LENGTH from env, using 8');
    PINCODE_LENGTH = 8;
}

/**
 * Express.js controller.
 * Create a new user, identified by the pincode.
 * Right now, the pincode is hardcoded to eight digits.
 * HTTP 201 will be set on success, HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
async function create(req, res, next) {
    const MAX_PINCODES = Math.pow(10, PINCODE_LENGTH);

    // get all current users
    let users;
    try {
        users = await db.User.find();
    } catch(err) {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
        return;
    }

    const pincodes = [];
    for (const user of users) {
        pincodes.push(user.pin);
    }

    if (pincodes.length === MAX_PINCODES) {
        logger.error('Exhausted random pincode possibilities');
        res.status(500).json({ error: {
            number: error.ServerError.E_UNKNOWN,
            message: 'Exhausted random pincode possibilities'
        }});
        return;
    }

    // generate a new, unique pin code
    var digits = new Array(PINCODE_LENGTH)
    var string = ''
    do {
        string = ''
        for (let i = 0; i < PINCODE_LENGTH; i++) {
            // first digit must not be zero
            if (i === 0) {
                digits[i] = Math.ceil(Math.random() * 9);
            } else {
                digits[i] = Math.floor(Math.random() * 10);
            }
            string += digits[i];
        }
    } while (pincodes.indexOf(Number.parseInt(string)) > -1);

    // add the new user to the db collection
    db.User.create({
        pin: Number.parseInt(string),
        created: new Date()
    }).then(user => {
        logger.info('Created user: ' + user.pin);
        res.status(201).json(user.pin);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}
