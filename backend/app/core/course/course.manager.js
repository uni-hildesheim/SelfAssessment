const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const db = require('../../db/db');
const JSONUtils = require('./../../utils/json');
const logger = require('./../../utils/logger');

module.exports = {
    loadCourses,
    setupAutodeploy
}

/**
 * Load course configuration files from the local filesystem, erasing any configuration that is
 * currently present/cached in the DB.
 *
 * @param {string} inputPath Path to course configuration files.
 *     This path should include several .json files, one for each course.
 *     Additionally, each course can have localized strings, which must reside in their own
 *     respective .json files in path/i18n/<json>.
 */
function loadCourses(inputPath) {
    let configFiles = [];
    let languageFiles = [];

    // TODO: Make this configurable
    const i18nPath = path.join(inputPath, '/i18n');

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
        configFiles = fs.readdirSync(inputPath);
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
            courseConfig = JSON.parse(fs.readFileSync(path.join(inputPath, item)));
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
                languageConfig = JSON.parse(fs.readFileSync(path.join(i18nPath, lang)));
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

/**
 * Watch a directory on the local filesystem for new .zip files and consume them, extracting their
 * contents to the specified output path.
 * The input .zip is destroyed after successful extraction, so the input directory should always be
 * empty unless a new set of configurations is deployed.
 *
 * @param {string} inputPath Path to be watched for .zip files.
 * @param {string} outputPath Path where .zip contents should be extracted.
 */
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

        // this ugly try/catch block is necessary because of sudden file removals which we cannot
        // detect - see the comment above - due to inconsistent library behavior
        try {
            fs.accessSync(path.join(inputPath, filename));
        } catch (err) {
            logger.warn('autodeply: Cannot access ' + filename + ' for reading');
            return;
        }

        let zip;
        let zipEntries;
        let extractZip = true;

        try {
            zip = new AdmZip(path.join(inputPath, filename));
            zipEntries = zip.getEntries();
        } catch (err) {
            logger.warn('autodeply: Failed to extract zip: ' + filename);
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
                if (!fs.existsSync(path.join(outputPath, zipEntry.entryName))) {
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
        fs.unlinkSync(path.join(inputPath, filename));
    });
}
