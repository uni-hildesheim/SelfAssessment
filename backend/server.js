// load environment config
require('dotenv').config();

const fs = require('fs');
const logger = require('./app/utils/logger');

// static configuration
var PORT = 8000;

const db = require('./app/mongodb/db.js');
var DB_URI = db.config.uri;

if (process.env.DB_URI) {
    DB_URI = process.env.DB_URI;
}

if (process.env.DB_USER) {
    db.config.options.user = process.env.DB_USER;
}

if (process.env.DB_PASS) {
    db.config.options.pass = process.env.DB_PASS;
}

if (process.env.APP_LOGLEVEL) {
    if (!(process.env.APP_LOGLEVEL in logger.Level)) {
        logger.log(logger.Level.ERROR, 'Invalid log level specified: ' + process.env.APP_LOGLEVEL);
    } else {
        logger.setLogLevel(process.env.APP_LOGLEVEL);
    }
}

if (process.env.APP_PORT) {
    PORT = process.env.APP_PORT;
}

// load dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// create the app
const app = express();
app.use(express.static('data/assets/public'));
app.use(bodyParser.json())

// enable cross-origin resource sharing
const corsOptions = {
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// load the API routes
require('./app/routes/index.js')(app);

// database initialization
logger.log(logger.Level.INFO, 'MongoDB URI: ' + DB_URI);
db.connect(DB_URI, db.config.options);

// drop all course configs from the db
db.Course.deleteMany({
    // wildcard filter
}).then(res => { // eslint-disable-line no-unused-vars
    // swallow
}).catch(err => {
    logger.log(logger.Level.WARN, 'Failed to drop course documents from db: ' + err);
});

// read available configs from local data dir
// TODO: validate configs
fs.readdir('./data/configs', (err, items) => {
    if (err) {
        logger.log(logger.Level.ERROR, err);
        return;
    }

    for (const item of items) {
        if (!item.endsWith('.json')) {
            // we only handle JSON files, so just exit in this case
            continue;
        }

        let courseConfig;
        try {
            courseConfig = JSON.parse(fs.readFileSync('./data/configs/' + item));
        } catch (err) {
            logger.log(logger.Level.WARN, 'Not a valid JSON file: ' + item + ': ' + err);
            continue;
        }
        const courseName = courseConfig['title'];
        if (!courseName) {
            logger.log(logger.Level.WARN, 'Config file does not have a valid title: ' + item);
            continue;
        }

        db.Course.create({
            name: courseName,
            config: courseConfig
        }).then(course => {
            logger.log(logger.Level.INFO, 'Created course in db: ' + course.name);
        }).catch(err => {
            logger.log(logger.Level.ERROR, err);
        });
    }
});

app.listen(PORT, () => {
    logger.log(logger.Level.INFO, 'Server running on port: ' + PORT);
});
