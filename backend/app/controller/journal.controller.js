const db = require('../mongodb/db.js');
const logger = require('../utils/logger');

module.exports = {
    load,
    loadLog,
    loadStructure,
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
            logger.warn('No journal for pin: ' + bodyPin);
            res.status(404).json({ error: 'No journal for pin: ' + bodyPin });
            return;
        }
        logger.info('Loaded journal for pin: ' + bodyPin);
        res.status(200).json(journal);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

// load a journal log (JSON object)
function loadLog(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    db.Journal.findOne({
        associatedPin: bodyPin
    }).then(journal => {
        if (!journal) {
            logger.warn('No journal log for pin: ' + bodyPin);
            res.status(404).json({ error: 'No journal log for pin: ' + bodyPin });
            return;
        }
        logger.info('Loaded journal log for pin: ' + bodyPin);
        res.status(200).json(journal.log);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

// load a journal structure (JSON object)
function loadStructure(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    db.Journal.findOne({
        associatedPin: bodyPin
    }).then(journal => {
        if (!journal) {
            logger.warn('No journal structure for pin: ' + bodyPin);
            res.status(404).json({ error: 'No journal structure for pin: ' + bodyPin });
            return;
        }
        logger.info('Loaded journal structure for pin: ' + bodyPin);
        res.status(200).json(journal.structure);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

// save a journal object (JSON object)
function save(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.Journal.updateOne({ associatedPin: bodyPin }, {
        lastChanged: new Date(),
        log: req.body.log,
        structure: req.body.structure
    }, { upsert: true }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Updated journal for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

// save a journal log (JSON object)
function saveLog(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.Journal.updateOne({ associatedPin: bodyPin }, {
        lastChanged: new Date(),
        log: req.body.log
    }, { upsert: true }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Updated journal log for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

// save a journal structure (JSON object)
function saveStructure(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.Journal.updateOne({ associatedPin: bodyPin }, {
        lastChanged: new Date(),
        structure: req.body.structure
    }, { upsert: true }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Updated journal structure for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}
