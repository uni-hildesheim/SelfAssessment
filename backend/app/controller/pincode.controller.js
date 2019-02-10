const db = require('../mongodb/db.js');
const logger = require('../utils/logger');

module.exports = {
    create
}

// create a pseudo-random pin code
async function create(req, res) {
    // length of the pin code, where each element is a digit
    // 8 --> 10*10*10*10*10*10*10*10 = 100.000.000 possibilities
    const LENGTH = 8
    const MAX_PINCODES = Math.pow(10, LENGTH);

    // get all current pincodes
    try {
        var pincodes = await db.Pincode.find();
    } catch(err) {
        logger.error(err);
        res.status(500).json({ error: 'DB error' });
        return;
    }

    if (pincodes.length === MAX_PINCODES) {
        logger.error('Exhausted random pincode possibilities');
        res.status(500).json({ error: 'Exhausted random pincode possibilities' });
        return;
    }

    // generate a new pincode
    var digits = new Array(LENGTH)
    var string = ''
    do {
        string = ''
        for (var i = 0; i < LENGTH; i++) {
            digits[i] = Math.floor(Math.random() * 10)
            string += digits[i]
        }
    } while (pincodes.indexOf(Number.parseInt(string)) > -1);

    // add the new pincode to the db collection
    db.Pincode.create({
        pin: Number.parseInt(string),
        created: new Date()
    }).then(pincode => {
        logger.info('Created pincode: ' + pincode.pin);
        res.status(201).json(pincode.pin);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}
