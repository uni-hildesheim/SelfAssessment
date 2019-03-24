// load environment config
require('dotenv').config();

// load 3rdparty dependencies
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');

// load local dependencies
const JSONUtils = require('./app/utils/json');
const db = require('./app/db/db');
const gc = require('./app/utils/gc');
const logger = require('./app/utils/logger');
const router = require('./app/core');
const overlord = require('./app/utils/overseer');
const error = require('./app/shared/error');
const CrashReporter = require('./app/utils/crashreporter');
const CourseManager = require('./app/core/course/course.manager');

// static configuration
let APP_LISTEN_PORT = 8000;
let CORS_OPTIONS = {
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

let LOG_OPTIONS = {
    limit: 0
}

let GC_OPTIONS = {
    user: {}
};

function loadEnvironment() {
    const LOG_LEVEL = process.env.LOG_LEVEL;
    const LOG_LIMIT = process.env.LOG_LIMIT;
    const LOG_TRACE = process.env.LOG_TRACE;
    const APP_PORT = process.env.APP_PORT;
    const CORS_ORIGINS = process.env.CORS_ORIGINS;
    const DB_URI = process.env.DB_URI;
    const DB_USER = process.env.DB_USER;
    const DB_PASS = process.env.DB_PASS;
    const GC_INTERVAL = process.env.GC_INTERVAL;
    const GC_USER_DONE = process.env.GC_USER_DONE;
    const GC_USER_LAST_UPDATE = process.env.GC_USER_LAST_UPDATE;
    const OVERLORD_ENABLE = process.env.OVERLORD_ENABLE;
    const CRASHREPORT_ENABLE = process.env.CRASHREPORT_ENABLE;
    const CRASHREPORT_SMTP_HOST = process.env.CRASHREPORT_SMTP_HOST;
    const CRASHREPORT_SMTP_PORT = process.env.CRASHREPORT_SMTP_PORT;
    const CRASHREPORT_SMTP_USER = process.env.CRASHREPORT_SMTP_USER;
    const CRASHREPORT_SMTP_PASS = process.env.CRASHREPORT_SMTP_PASS;
    const CRASHREPORT_MAIL_RECIPIENT = process.env.CRASHREPORT_MAIL_RECIPIENT;

    if (LOG_LEVEL) {
        if (!(LOG_LEVEL in logger.Level)) {
            logger.all('Invalid log level specified: ' + LOG_LEVEL);
        } else {
            logger.setLogLevel(LOG_LEVEL);
            logger.info('env: LOG_LEVEL=' + LOG_LEVEL);
        }
    }

    if (LOG_LIMIT) {
        let limit = parseInt(LOG_LIMIT, 10);
        if (isNaN(limit)) {
            logger.warn('Invalid log limit specified: ' + LOG_LIMIT);
        } else {
            logger.info('env: LOG_LIMIT=' + LOG_LIMIT);
            LOG_OPTIONS.limit = limit;
        }
    }

    if (LOG_TRACE) {
        logger.enableTracing();
    }

    if (DB_URI) {
        logger.info('env: DB_URI=' + DB_URI);
        db.config.uri = DB_URI;
    }

    if (DB_USER) {
        logger.info('env: DB_USER=' + DB_USER);
        db.config.options.user = DB_USER;
    }

    if (DB_PASS) {
        logger.info('env: DB_PASS=' + DB_PASS);
        db.config.options.pass = DB_PASS;
    }

    if (APP_PORT) {
        logger.info('env: APP_PORT=' + APP_PORT);
        APP_LISTEN_PORT = APP_PORT;
    }

    if (CORS_ORIGINS) {
        logger.info('env: CORS_ORIGINS=' + CORS_ORIGINS);
        CORS_OPTIONS.origin = function (origin, callback) {
            if (CORS_ORIGINS.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                logger.warn('CORS: denying request from: ' + origin);
                callback('Not allowed by CORS');
            }
        }
    }

    if (GC_INTERVAL) {
        logger.info('env: GC_INTERVAL=' + GC_INTERVAL);

        if (GC_USER_DONE) {
            if (GC_USER_DONE == true) {
                GC_OPTIONS['user']['done'] = true;
            } else if (GC_USER_DONE == false) {
                GC_OPTIONS['user']['done'] = false;
            }
        }

        if (GC_USER_LAST_UPDATE) {
            try {
                GC_OPTIONS['user']['lastUpdate'] = Number.parseInt(GC_USER_LAST_UPDATE);
            } catch (err) {
                // swallow
            }
        }

        gc.addTask((options) => {
            const query = {};
            if ('user' in options) {
                if ('done' in options['user']) {
                    if (options['user']['done'] == true) {
                        query['result.validationCode'] = {
                            '$ne': null
                        }
                    } else {
                        query['result.validationCode'] = null;
                    }
                }

                if ('lastUpdate' in options['user']) {
                    const referenceDate = new Date();
                    referenceDate.setDate(referenceDate.getDate() - options['user']['lastUpdate']);
                    query['journal.lastUpdate'] = {
                        '$lt': referenceDate
                    };
                }
            }

            logger.debug('GC: Removing users for query: ' + JSON.stringify(query, null, 2));
            db.User.deleteMany(query).then(result => {
                logger.info('GC: removed ' + result.n + ' user objects');
            }).catch(err => {
                logger.error(err);
            });
        }, GC_OPTIONS);
        gc.start(GC_INTERVAL);
    }

    if (!OVERLORD_ENABLE) {
        overlord.options.enableWrapping = false;
    }

    if (CRASHREPORT_ENABLE) {
        if (!CRASHREPORT_SMTP_HOST || !CRASHREPORT_SMTP_PORT || !CRASHREPORT_SMTP_USER
            || !CRASHREPORT_SMTP_PASS || !CRASHREPORT_MAIL_RECIPIENT) {
            logger.warn('Missing parameters for crash report feature!\n'
                        + 'Required: CRASHREPORT_SMTP_HOST, CRASHREPORT_SMTP_PORT,'
                        + ' CRASHREPORT_SMTP_USER, CRASHREPORT_SMTP_PASS,'
                        + ' CRASHREPORT_MAIL_RECIPIENT');
        } else {
            const transport = new CrashReporter.Transport.EmailTransport(CRASHREPORT_MAIL_RECIPIENT);
            const auth = {
                user: CRASHREPORT_SMTP_USER,
                pass: CRASHREPORT_SMTP_PASS
            }
            transport.configure(CRASHREPORT_SMTP_HOST, CRASHREPORT_SMTP_PORT, auth);
            CrashReporter.addTransport(transport);
        }
    }
}

function createApp() {
    const app = express();
    app.use(express.static('data/assets/public'));
    app.use(bodyParser.json());

    // enable cross-origin resource sharing
    app.use(cors(CORS_OPTIONS));

    // load the API routes
    router(app);

    // register catch-all error handler
    app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
        // if we did not handle the error elsewhere, do it here
        if (!res._headerSent) {
            logger.error(err);
            res.status(500).json({ error: error.ServerError.E_UNKNOWN }).send();
        }

        CrashReporter.sendReport(err, CrashReporter.ReportType.GENERIC);
    })

    return app;
}

function loadFrontendResources(path) {
    let configFiles = [];
    let languageFiles = [];

    // TODO: Make this configurable
    const i18nPath = path + '/i18n';

    // drop all current course configs from the db
    db.Frontend.deleteMany({
        // wildcard filter
    }).then(res => { // eslint-disable-line no-unused-vars
        // swallow
    }).catch(err => {
        logger.warn('Failed to drop frontend resources from db: ' + err);
    });

    try {
        // read available configs from local data dir
        configFiles = fs.readdirSync(path);
    } catch (err) {
        logger.error(err);
        return;
    }

    try {
        // read available configs from local data dir
        languageFiles = fs.readdirSync(i18nPath);
    } catch (err) {
        logger.error(err);
        return;
    }

    for (const item of configFiles) {
        let resourceConfigs = [];
        const configName = item.split('.')[0];
        if (!item.endsWith('.json')) {
            // we only handle JSON files, so just exit in this case
            continue;
        }

        let resourceConfig;
        try {
            resourceConfig = JSON.parse(fs.readFileSync(path + '/' + item));
        } catch (err) {
            logger.warn('Not a valid JSON file: ' + item + ': ' + err);
            continue;
        }

        // see what languages are available
        for (const lang of languageFiles) {
            if (!lang.endsWith('.json')) {
                // we only handle JSON files, so just exit in this case
                continue;
            }

            let elems = lang.split('_');
            if (elems.length < 2) {
                logger.warn('Not a valid language file: ' + lang);
                continue
            }

            if (elems[0] !== configName) {
                // looks like this language file does not belong to this config
                continue;
            }

            let languageConfig;
            try {
                languageConfig = JSON.parse(fs.readFileSync(i18nPath + '/' + lang));
            } catch (err) {
                logger.warn('Not a valid JSON file: ' + lang + ': ' + err);
                continue;
            }

            // language files must have a 'language' attribute
            if (!('language' in languageConfig)) {
                logger.warn('Language config: ' + lang + ' lacks "language" attribute');
                continue;
            }

            // attempt to merge the course with the language config to see if all references
            // resolve correctly
            const mergedConfig = JSONUtils.mergeObjects([resourceConfig, languageConfig]);
            if (mergedConfig === null) {
                logger.warn('Failed to merge resource config: ' + item + ' with language' +
                            ' config: ' + lang);
                continue;
            }

            // add the translated config to our set
            resourceConfigs.push(mergedConfig);
        }

        db.Frontend.create({
            name: resourceConfig['name'],
            created: new Date(),
            configs: resourceConfigs
        }).then(resource => {
            let languageNames = []
            for (const obj of resource.configs) {
                languageNames.push(obj.language);
            }
            logger.info('Created frontend resource config in db: ' + resource.name +
                        ', languages: ' + languageNames);
        }).catch(err => {
            logger.error(err);
        });
    }
}

/**
 * Initialize the global logger.
 * Adds file based logging in the specified logdir.
 * @param {string} logdir Directory where log files are stored.
 */
function setupLogger(logdir) {
    let logFiles;

    try {
        logFiles = fs.readdirSync(logdir);
    } catch (err) {
        logger.error(err);
        return;
    }

    const date = new Date();
    let logFileName = date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate();
    let logFileIndex = 0;
    let logFilePostfix = '.log';

    while (logFiles.includes(logFileName + '_' + logFileIndex + logFilePostfix)) {
        logFileIndex++;
    }

    // add file transport to global logger
    const logFilePath = logdir + logFileName + "_" + logFileIndex + logFilePostfix;
    const fileTransport = new logger.Transport.FileTransport(logFilePath);
    fileTransport.limit = LOG_OPTIONS.limit;
    logger.addTransport(fileTransport);
}

async function main() {
    loadEnvironment();

    // create the app
    const app = createApp();

    // log to a file
    setupLogger('./data/logs/');

    // connect to DB
    logger.info('MongoDB URI: ' + db.config.uri);
    try {
        const connection = await db.connect(db.config.uri, db.config.options);
        connection.on('error', function (err) {
            CrashReporter.sendReport(err, CrashReporter.ReportType.DB);
        });
    } catch (err) {
        logger.error('Failed to connect to MongoDB: ' + err);
        return;
    }

    // sync frontend resource configs
    loadFrontendResources('./data/configs/frontend');

    // sync course configs
    CourseManager.loadCourses('./data/configs/courses');

    // enable autodeploy support
    CourseManager.setupAutodeploy('./data/autodeploy', './data');

    // actually start the Express.js server
    app.listen(APP_LISTEN_PORT, () => {
        logger.info('Server running on port: ' + APP_LISTEN_PORT);
    });
}

if (require.main == module) {
    main();
}
