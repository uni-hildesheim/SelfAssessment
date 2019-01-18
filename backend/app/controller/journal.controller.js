const db = require('../mongodb/db.js');

module.exports = {
    load,
    save
}

// load a journal from the DB
function load(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    db.Journal.findOne({
        associatedPin: bodyPin
    }).then(journal => {
        if (!journal) {
            res.status(404).json({ error: 'No journal for pin: ' + bodyPin });
            return;
        }
        console.log('Loaded journal for pin: ' + bodyPin);
        res.status(200).json(journal);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}

// save a journal object (JSON object)
function save(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.Journal.updateOne({ associatedPin: bodyPin }, {
        data: req.body.data
    }, { upsert: true }).then(result => { // eslint-disable-line no-unused-vars
        console.log('Updated journal for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}
