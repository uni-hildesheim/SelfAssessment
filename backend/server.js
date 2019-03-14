// load environment config
require('dotenv').config();

// load 3rdparty dependencies
const AdmZip = require('adm-zip');
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

// static configuration
let APP_LISTEN_PORT = 8000;
let CORS_OPTIONS = {
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

let LOG_OPTIONS = {
    level: logger.Level.INFO,
    limit: 0,
    trace: false
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

    if (LOG_LEVEL) {
        if (!(LOG_LEVEL in logger.Level)) {
            logger.warn('Invalid log level specified: ' + LOG_LEVEL);
        } else {
            logger.info('env: LOG_LEVEL=' + LOG_LEVEL);
            LOG_OPTIONS.level = LOG_LEVEL;
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
        LOG_OPTIONS.trace = true;
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
    })

    return app;
}

function loadCourses(path) {
    let configFiles = [];
    let languageFiles = [];

    // TODO: Make this configurable
    const i18nPath = path + '/i18n';

    // drop all current course configs from the db
    db.Course.deleteMany({
        // wildcard filter
    }).then(res => { // eslint-disable-line no-unused-vars
        // swallow
    }).catch(err => {
        logger.warn('Failed to drop course documents from db: ' + err);
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
        let courseConfigs = [];
        const configName = item.split('.')[0];
        if (!item.endsWith('.json')) {
            // we only handle JSON files, so just exit in this case
            continue;
        }

        let courseConfig;
        try {
            courseConfig = JSON.parse(fs.readFileSync(path + '/' + item));
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
            const mergedConfig = JSONUtils.mergeObjects([courseConfig, languageConfig]);
            if (mergedConfig === null) {
                logger.warn('Failed to merge course config: ' + item + ' with language config: ' +
                            lang);
                continue;
            }

            // add the translated config to our set
            courseConfigs.push({
                'language': languageConfig['language'],
                'config': mergedConfig
            });
        }

        // validate merged config
        if (!db.Course.validateConfig(courseConfig)) {
            logger.warn('Not a valid config file: ' + item);
            continue;
        }

        db.Course.create({
            name: courseConfig['title'],
            icon: courseConfig['icon'],
            configs: courseConfigs
        }).then(course => {
            let languageNames = []
            for (const obj of course.configs) {
                languageNames.push(obj.language);
            }
            logger.info('Created course in db: ' + course.name + ', languages: ' + languageNames);
        }).catch(err => {
            logger.error(err);
        });
    }
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

function setupAutodeploy(inputPath, outputPath) {
    fs.watch(inputPath, (eventType, filename) => {
        // apparently eventType is bogus on various platforms: on macOS, it is always 'rename',
        // regardless of whether a new file is inserted, one is deleted, etc.
        // -> ignore eventType for now

        // only handle zip files
        if (!filename.endsWith('.zip')) {
            logger.warn('autodeploy: ' + filename + ' is not a zip file');
            return;
        }

        let zip;
        let zipEntries;
        let extractZip = true;

        // this ugly try/catch block is necessary because of sudden file removals which we cannot
        // detect - see the comment above - due to inconsistent library behavior
        try {
            zip = new AdmZip(inputPath + '/' + filename);
            zipEntries = zip.getEntries();
        } catch (err) {
            return;
        }

        zipEntries.forEach(zipEntry => {
            // determine whether this entry is a top-level file:
            //   1. entryName contains exactly zero slashes
            //   2. isDirectory is false
            const isTopLevelFile = (zipEntry.entryName.split('/').length - 1 == 0) &&
                (!zipEntry.isDirectory);
            if (isTopLevelFile) {
                logger.warn('autodeploy: ' + filename +
                    ' contains non-directory top-level entry: ' + zipEntry.name);
                extractZip = false;
                return;
            }

            // top-level directory entries must exist in our local fs structure
            // determine whether this entry is a top-level dir:
            //   1. entryName contains exactly two slashes
            //   2. isDirectory is true
            const isTopLevelDir = (zipEntry.entryName.split('/').length - 1 == 2) &&
                (zipEntry.isDirectory);
            if (isTopLevelDir) {
                if (!fs.existsSync(outputPath + '/' + zipEntry.entryName)) {
                    logger.warn('autodeploy: top-level directory entry: ' +
                        zipEntry.entryName + ' does not exist in local filesystem: ' + outputPath +
                        ' is not a zip file');
                    extractZip = false;
                    return;
                }
            }
        });

        if (extractZip) {
            logger.info('autodeploy: extracting archive: ' + filename + ' to: ' +
                outputPath);
            zip.extractAllTo(outputPath, true /* overwrite */);
            // force config file reload
            logger.info('autodeploy: forcing course reload');
            loadCourses('./data/configs/courses');
        } else {
            logger.warn('autodeploy: not extracting file: ' + filename);
        }

        // remove the zip in all cases
        fs.unlinkSync(inputPath + '/' + filename);
    });
}

async function main() {
    loadEnvironment();

    // create the app
    const app = createApp();

    // setup logger
    logger.setLogLevel(LOG_OPTIONS.level);
    if (LOG_OPTIONS.trace) {
        logger.enableTracing();
    }

    // log to a file
    const logFiles = fs.readdirSync('./data/logs/');

    const date = new Date();
    let logFileName = date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate();
    let logFileIndex = 0;
    let logFilePostfix = '.log';

    while (logFiles.includes(logFileName + '_' + logFileIndex + logFilePostfix)) {
        logFileIndex++;
    }

    const logFilePath = './data/logs/' + logFileName + "_" + logFileIndex + logFilePostfix;


    const fileTransport = new logger.Transport.FileTransport(logFilePath);
    fileTransport.limit = LOG_OPTIONS.limit;
    logger.addTransport(fileTransport);

    // connect to DB
    logger.info('MongoDB URI: ' + db.config.uri);
    try {
        await db.connect(db.config.uri, db.config.options);
    } catch (err) {
        logger.error('Failed to connect to MongoDB: ' + err);
        return;
    }

    // sync frontend resource configs
    loadFrontendResources('./data/configs/frontend');

    // sync course configs
    loadCourses('./data/configs/courses');

    // enable autodeploy support
    setupAutodeploy('./data/autodeploy', './data');

    // actually start the Express.js server
    app.listen(APP_LISTEN_PORT, () => {
        logger.info('Server running on port: ' + APP_LISTEN_PORT);
    });
}

if (require.main == module) {
    main();
}
