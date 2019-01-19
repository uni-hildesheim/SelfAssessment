const db = require('../mongodb/db.js');

module.exports = {
    create
}

// create a pseudo-random pin code
function create(req, res) {
    // length of the pin code, where each element is a digit
    // 8 --> 10*10*10*10*10*10*10*10 = 100.000.000 possibilities
    const LENGTH = 8
    const MAX_PINCODES = Math.pow(10, LENGTH);

    var digits = new Array(LENGTH)
    var string = ''

    // get all current pincodes
    db.Pincode.find().then(pincodes => {
        if (pincodes.length === MAX_PINCODES) {
            res.status(500).json({ error: 'Exhausted random pincode possibilities' });
            return;
        }

        // generate a new pincode
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
            res.status(201).json(pincode);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}
