const fs = require('fs');
const logger = require('./app/utils/logger');

// static configuration
var PORT = 8000;

const db = require('./app/mongodb/db.js');
var DB_URI = db.config.uri;

for (var arg of process.argv) {
    if (arg.startsWith('--port=')) {
        PORT = arg.split('=')[1];
    } else if (arg.startsWith('--mongouri=')) {
        DB_URI = arg.split('=')[1];
    }
}

// load dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// create the app
const app = express();
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
