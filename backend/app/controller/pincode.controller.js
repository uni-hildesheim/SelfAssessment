const db = require('../mongodb/db.js');

module.exports = {
    create
}

// create a pseudo-random pin code
function create(req, res) {
    // length of the pin code, where each element is a digit
    // 8 --> 10*10*10*10*10*10*10*10 = 100.000.000 possibilities
    const LENGTH = 8
    const MAX_TRIES = Math.pow(10, 8);

    var digits = new Array(LENGTH)
    var string = ''
    var tries = 0

    do {
        tries++;
        if (tries > MAX_TRIES) {
            res.status(500).json({ error: 'Exhausted random pincode possibilities' });
            return;
        }

        string = ''
        for (var i = 0; i < LENGTH; i++) {
            digits[i] = Math.floor(Math.random() * 10)
            string += digits[i]
        }

    } while (db.Pincode.pinExists(Number.parseInt(string)));

    db.Pincode.create({
        pin: Number.parseInt(string),
        created: new Date()
    }).then(pincode => {
        res.json(pincode);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}
