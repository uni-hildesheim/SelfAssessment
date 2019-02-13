const db = require('../mongodb/db');
const logger = require('../utils/logger');

module.exports = {
    loadLog,
    loadStructure,
    saveLog,
    saveStructure
}

// load a journal log (JSON object)
function loadLog(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    db.User.findOne({
        pin: bodyPin
    }).then(user => {
        if (!user) {
            logger.warn('No user for pin: ' + bodyPin);
            res.status(404).json({ error: 'No user for pin: ' + bodyPin });
            return;
        }

        if (!user.journal) {
            logger.warn('No journal log for pin: ' + bodyPin);
            res.status(404).json({ error: 'No journal log for pin: ' + bodyPin });
            return;
        }
        logger.info('Loaded journal log for pin: ' + bodyPin);
        res.status(200).json(user.journal.log);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

// load a journal structure (JSON object)
function loadStructure(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    db.User.findOne({
        pin: bodyPin
    }).then(user => {
        if (!user) {
            logger.warn('No user for pin: ' + bodyPin);
            res.status(404).json({ error: 'No user for pin: ' + bodyPin });
            return;
        }

        if (!user.journal) {
            logger.warn('No journal structure for pin: ' + bodyPin);
            res.status(404).json({ error: 'No journal structure for pin: ' + bodyPin });
            return;
        }
        logger.info('Loaded journal structure for pin: ' + bodyPin);
        res.status(200).json(user.journal.structure);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

// save a journal log (JSON object)
function saveLog(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // update the document if it exists
    db.User.updateOne({ pin: bodyPin }, {
        'journal.lastChanged': new Date(),
        'journal.log': req.body.log
    }, { upsert: false }).then(result => { // eslint-disable-line no-unused-vars
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
    db.User.updateOne({ pin: bodyPin }, {
        'journal.lastChanged': new Date(),
        'journal.structure': req.body.structure
    }, { upsert: false }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Updated journal structure for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}
