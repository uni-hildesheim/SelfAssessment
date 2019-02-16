const db = require('../../db/db');
const logger = require('../../utils/logger');
const error = require('../../shared/error');

module.exports = {
    create
}

// create a pseudo-random pin code
async function create(req, res) {
    // length of the pin code, where each element is a digit
    // 8 --> 10*10*10*10*10*10*10*10 = 100.000.000 possibilities
    const LENGTH = 8
    const MAX_PINCODES = Math.pow(10, LENGTH);

    // get all current users
    let users;
    try {
        users = await db.User.find();
    } catch(err) {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
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

    // create a new user
    var digits = new Array(LENGTH)
    var string = ''
    do {
        string = ''
        for (let i = 0; i < LENGTH; i++) {
            // first digit must not be zero
            if (i === 0) {
                digits[i] = Math.ceil(Math.random() * 9);
            } else {
                digits[i] = Math.floor(Math.random() * 10);
            }
            string += digits[i];
        }
    } while (pincodes.indexOf(Number.parseInt(string)) > -1);

    // add the new pincode to the db collection
    db.User.create({
        pin: Number.parseInt(string),
        created: new Date()
    }).then(user => {
        logger.info('Created user: ' + user.pin);
        res.status(201).json(user.pin);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
    });
}
