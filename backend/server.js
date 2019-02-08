// load environment config
require('dotenv').config();

// load 3rdparty dependencies
const AdmZip = require('adm-zip');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');

// load local dependencies
const courseUtils = require('./app/utils/course');
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
        logger.log(logger.Level.WARN, 'Failed to drop course documents from db: ' + err);
    });

    try {
        // read available configs from local data dir
        configFiles = fs.readdirSync(path);
    } catch (err) {
        logger.log(logger.Level.ERROR, err);
        return;
    }

    try {
        // read available configs from local data dir
        languageFiles = fs.readdirSync(i18nPath);
    } catch (err) {
        logger.log(logger.Level.ERROR, err);
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
            logger.log(logger.Level.WARN, 'Not a valid JSON file: ' + item + ': ' + err);
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
                logger.log(logger.Level.WARN, 'Not a valid language file: ' + lang);
                continue
            }

            if (elems[0] !== configName) {
                // looks like this language file does not belong to this config
                continue;
            }

            elems = elems[1].split('.');
            if (elems.length < 2) {
                // what language is this? no idea
                continue;
            }

            let languageConfig;
            try {
                languageConfig = JSON.parse(fs.readFileSync(i18nPath + '/' + lang));
            } catch (err) {
                logger.log(logger.Level.WARN, 'Not a valid JSON file: ' + lang + ': ' + err);
                continue;
            }

            // attempt to merge the course with the language config to see if all references
            // resolve correctly
            const mergedConfig = courseUtils.mergeConfigs([courseConfig, languageConfig]);
            if (mergedConfig === null) {
                logger.log(logger.Level.WARN, 'Failed to merge course config: ' + item + ' with' +
                           ' language config: ' + lang);
                continue;
            }

            // add the translated config to our set
            courseConfigs.push({
                'language': elems[0],
                'config': mergedConfig
            });
        }

        // validate merged config
        if (!courseUtils.validateConfig(courseConfig)) {
            logger.log(logger.Level.WARN, 'Not a valid config file: ' + item);
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
            logger.log(logger.Level.INFO, 'Created course in db: ' + course.name +
                       ', languages: ' + languageNames);
        }).catch(err => {
            logger.log(logger.Level.ERROR, err);
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
            logger.log(logger.Level.WARN, 'autodeploy: ' + filename + ' is not a zip file');
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
                logger.log(logger.Level.WARN, 'autodeploy: ' + filename +
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
                    logger.log(logger.Level.WARN, 'autodeploy: top-level directory entry: ' +
                        zipEntry.entryName + ' does not exist in local filesystem: ' + outputPath +
                        ' is not a zip file');
                    extractZip = false;
                    return;
                }
            }
        });

        if (extractZip) {
            logger.log(logger.Level.INFO, 'autodeploy: extracting archive: ' + filename + ' to: ' +
                outputPath);
            zip.extractAllTo(outputPath, true /* overwrite */);
            // force config file reload
            logger.log(logger.Level.INFO, 'autodeploy: forcing course reload');
            loadCourses('./data/configs');
        } else {
            logger.log(logger.Level.WARN, 'autodeploy: not extracting file: ' + filename);
        }

        // remove the zip in all cases
        fs.unlinkSync(inputPath + '/' + filename);
    });
}

function main() {
    // add console transport for non-production environments
    if (process.env.NODE_ENV !== 'production') {
        logger.addTransport(new logger.ConsoleTransport(1));
    }

    loadEnvironment();

    // create the app
    const app = createApp();

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

    let fileStream = fs.createWriteStream(
        logFilePath,
        {
            'flags': 'w'
        }
    );

    fileStream.on('error', (err) => {
        console.error("Failed to create logger file-based transport: " + err);
        fileStream.end();
    });

    logger.addTransport(new logger.FileTransport(0, fileStream));

    // connect to DB
    logger.log(logger.Level.INFO, 'MongoDB URI: ' + db.config.uri);
    db.connect(db.config.uri, db.config.options);

    // sync course configs
    loadCourses('./data/configs');

    // enable autodeploy support
    setupAutodeploy('./data/autodeploy', './data');

    // actually start the Express.js server
    app.listen(APP_LISTEN_PORT, () => {
        logger.log(logger.Level.INFO, 'Server running on port: ' + APP_LISTEN_PORT);
    });
}

if (require.main == module) {
    main();
}
