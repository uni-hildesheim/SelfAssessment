const db = require('../mongodb/db.js');
const logger = require('../utils/logger');

module.exports = {
    loadConfig,
    showCourses
}

// load a course from the DB
function loadConfig(req, res) {
    const name = req.body.name;

    db.Course.findOne({
        name: name
    }).then(course => {
        if (!course) {
            logger.log(logger.Level.WARN, 'No such course: ' + name);
            res.status(404).json({ error: 'No such course: ' + name });
            return;
        }
        logger.log(logger.Level.INFO, 'Loaded course config: ' + name);
        res.status(200).json(course.config);
    }).catch(err => {
        logger.log(logger.Level.ERROR, err);
        res.status(500).json({ error: err });
    });
}

// show all courses that are available
function showCourses(req, res) {
    db.Course.find({
        // wildcard filter
    }).then(courses => {
        let names = []
        for (let course of courses) {
            logger.log(logger.Level.INFO, 'Available course: ' + course.name);
            names.push(course.name);
        }
        res.status(200).json(names);
    }).catch(err => {
        logger.log(logger.Level.ERROR, err);
        res.status(500).json({ error: err });
    });
}
