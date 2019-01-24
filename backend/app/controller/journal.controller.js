const db = require('../mongodb/db.js');
const logger = require('../utils/logger');

module.exports = {
    load,
    save,
    saveLog,
    saveStructure
}

// load a journal from the DB
function load(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    db.Journal.findOne({
        associatedPin: bodyPin
    }).then(journal => {
        if (!journal) {
            logger.log(logger.Level.WARN, 'No journal for pin: ' + bodyPin);
            res.status(404).json({ error: 'No journal for pin: ' + bodyPin });
            return;
        }
        logger.log(logger.Level.INFO, 'Loaded journal for pin: ' + bodyPin);
        res.status(200).json(journal);
    }).catch(err => {
        logger.log(logger.Level.ERROR, err);
        res.status(500).json({ error: err });
    });
}

// save a journal object (JSON object)
function save(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.Journal.updateOne({ associatedPin: bodyPin }, {
        log: req.body.log,
        structure: req.body.structure
    }, { upsert: true }).then(result => { // eslint-disable-line no-unused-vars
        logger.log(logger.Level.INFO, 'Updated journal for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.log(logger.Level.ERROR, err);
        res.status(500).json({ error: err });
    });
}

// save a journal log (JSON object)
function saveLog(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.Journal.updateOne({ associatedPin: bodyPin }, {
        log: req.body.log
    }, { upsert: true }).then(result => { // eslint-disable-line no-unused-vars
        logger.log(logger.Level.INFO, 'Updated journal log for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.log(logger.Level.ERROR, err);
        res.status(500).json({ error: err });
    });
}

// save a journal structure (JSON object)
function saveStructure(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.Journal.updateOne({ associatedPin: bodyPin }, {
        structure: req.body.structure
    }, { upsert: true }).then(result => { // eslint-disable-line no-unused-vars
        logger.log(logger.Level.INFO, 'Updated journal structure for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.log(logger.Level.ERROR, err);
        res.status(500).json({ error: err });
    });
}
