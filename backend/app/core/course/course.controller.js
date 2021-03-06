const db = require('../../db/db');
const logger = require('../../utils/logger');
const error = require('../../shared/error');

module.exports = {
    loadConfig,
    showCourses
}

/**
 * Express.js controller.
 * Load course configurations from the database and return them in the response object.
 * HTTP 200 will be set on success, HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function loadConfig(req, res, next) {
    const name = req.body.name;
    const language = req.body.language;

    db.Course.findOne({
        name: name
    }).then(course => {
        if (!course) {
            logger.warn('No such course: ' + name);
            res.status(404).json({ error: error.ServerError.E_DBQUERY });
            return;
        }

        for (const config of course.configs) {
            if (language === config.language) {
                logger.info('Loaded course config: ' + name + ' for language: ' + language);
                res.status(200).json(config.config);
                return;
            }
        }

        logger.warn('Language: ' + language + ' not available for course: ' + name);
        res.status(404).json({ error: error.ServerError.E_DBQUERY });
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}

/**
 * Express.js controller.
 * List available course configurations from the database and return name, icon and languages in
 * the response object.
 * HTTP 200 will be set on success, HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function showCourses(req, res, next) {
    db.Course.find({
        // wildcard filter
    }).then(courses => {
        let meta = []
        for (const course of courses) {
            let languages = [];
            for (const config of course.configs) {
                languages.push(config.language);
            }

            logger.info('Available course: ' + course.name + ', languages: ' + languages);
            meta.push({
                "name": course.name,
                "icon": course.icon,
                "languages": languages
            });
        }
        res.status(200).json(meta);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}
