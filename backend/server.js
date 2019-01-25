// load environment config
require('dotenv').config();

// load 3rdparty dependencies
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');

// load local dependencies
const db = require('./app/mongodb/db.js');
const logger = require('./app/utils/logger');
const router = require('./app/routes/index.js');

// static configuration
let APP_LISTEN_PORT = 8000;

function loadEnvironment() {
    const APP_LOGLEVEL = process.env.APP_LOGLEVEL;
    const APP_PORT = process.env.APP_PORT;
    const DB_URI = process.env.DB_URI;
    const DB_USER = process.env.DB_USER;
    const DB_PASS = process.env.DB_PASS;

    if (DB_URI) {
        logger.log(logger.Level.INFO, 'env: DB_URI=' + DB_URI);
        db.config.uri = DB_URI;
    }

    if (DB_USER) {
        logger.log(logger.Level.INFO, 'env: DB_USER=' + DB_USER);
        db.config.options.user = DB_USER;
    }

    if (DB_PASS) {
        logger.log(logger.Level.INFO, 'env: DB_PASS=' + DB_PASS);
        db.config.options.pass = DB_PASS;
    }

    if (APP_LOGLEVEL) {
        if (!(APP_LOGLEVEL in logger.Level)) {
            logger.log(logger.Level.ERROR, 'Invalid log level specified: ' + APP_LOGLEVEL);
        } else {
            logger.log(logger.Level.INFO, 'env: APP_LOGLEVEL=' + APP_LOGLEVEL);
            logger.setLogLevel(APP_LOGLEVEL);
        }
    }

    if (APP_PORT) {
        logger.log(logger.Level.INFO, 'env: APP_PORT=' + APP_PORT);
        APP_LISTEN_PORT = APP_PORT;
    }
}

function createApp() {
    const app = express();
    app.use(express.static('data/assets/public'));
    app.use(bodyParser.json());

    // enable cross-origin resource sharing
    const corsOptions = {
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    app.use(cors(corsOptions));

    // load the API routes
    router(app);

    return app;
}

function loadCourses(path) {
    // drop all current course configs from the db
    db.Course.deleteMany({
        // wildcard filter
    }).then(res => { // eslint-disable-line no-unused-vars
        // swallow
    }).catch(err => {
        logger.log(logger.Level.WARN, 'Failed to drop course documents from db: ' + err);
    });

    // read available configs from local data dir
    // TODO: validate configs
    fs.readdir(path, (err, items) => {
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
                courseConfig = JSON.parse(fs.readFileSync(path + '/' + item));
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
}

function main() {
    loadEnvironment();

    // create the app
    const app = createApp();

    // connect to DB
    logger.log(logger.Level.INFO, 'MongoDB URI: ' + db.config.uri);
    db.connect(db.config.uri, db.config.options);

    // sync course configs
    loadCourses('./data/configs');

    // actually start the Express.js server
    app.listen(APP_LISTEN_PORT, () => {
        logger.log(logger.Level.INFO, 'Server running on port: ' + APP_LISTEN_PORT);
    });
}

if (require.main == module) {
    main();
}
