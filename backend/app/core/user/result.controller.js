const db = require('../../db/db');
const logger = require('../../utils/logger');

module.exports = {
    calculate,
    load,
    lock,
    update
}

/**
 * Calculate result for a user based on the course config and journal (log and structure).
 *
 * @param {JSON} config Course config
 * @param {JSON} journal Journal object containing log and structure
 * @returns Array of single test results on success, null otherwise
 *
 * Example output array:
  [
    {
      "correctOptions": [
        0
      ],
      "wrongOptions": [
        1
      ],
      "id": "1002",
      "score": 1,
      "maxScore": 2
    },
  ]
 *
 */
function calculate(config, journal) {
    /* 
     * INPUT DATA LAYOUT
     *
     * journal.structure: Which tests the user answered.
     * journal.log: How the user answered a test.
     *
     * Based on this structure, we can determine how each single test was answered. Following that,
     * we can assign points based on the course config, which contains information on which options
     * were 'correct' for a certain test.
     *
     * To ease calculations and data handling, we gather all necessary information (config, log)
     * for each single test first.
     */
    let testsData = {};
    for (const set of journal.structure.sets) {
        for (const singleTestID of set.tests) {
            let testConfig = null;
            let testLog = null;

            // get the test config
            for (const test of config['tests']) {
                if (test['id'] === singleTestID) {
                    testConfig = test;
                    break;
                }
            }

            // this should never happen, but just in case..
            if (testConfig === null) {
                logger.warn('Could not find test config for id: ' + singleTestID);
                return null;
            }

            // check whether this test should be evaluated at all
            if (testConfig['evaluated'] === false) {
                logger.debug('Skipping test: ' + singleTestID + '; it is not marked as evaluated');
                continue;
            }

            // get the test log
            for (const set of journal.log.sets) {
                for (const map of set.maps) {
                    if (map['key'] === singleTestID) {
                        // found the test config
                        testLog = map['val'];
                        break;
                    }
                }
            }

            // again, this should never happen, but just in case..
            if (testLog === null) {
                logger.warn('Could not find test log for id: ' + singleTestID);
                return null;
            }

            // everything we need is available by now
            testsData[singleTestID] = {
                config: testConfig,
                log: testLog
            };
        }
    }

    /*
     * OUTPUT DATA LAYOUT
     *
     * tests: Array of objects containing information about each single test:
     *   id: test ID
     *   score: test score, aka the number of correct answers (selected options)
     *   maxScore: maximum achievable test score, calculated by the number of 'correct'
     *             attributes in the test configs' options[] array
     *   correctOptions: Array of indices of correctly answered questions (options)
     */
    let tests = [];
    for (const key in testsData) {
        const test = testsData[key];
        let result = {
            id: key,
            score: 0,
            maxScore: 0,
            correctOptions: [],
            wrongOptions: []
        }

        // calculate max score for this test
        for (const opt of test.config['options']) {
            if ('correct' in opt) {
                result.maxScore++;
            }
        }

        // calculate actual score based on test category
        if (test.config['category'] === 'checkbox') {
            for (let i = 0; i < test.log.length; i++) {
                const testOptions = test.config['options'];
                const correctOption = testOptions[i]['correct'] === true ? true : false;
                if (test.log[i] === true && test.log[i] === correctOption) {
                    // correct option was selected, award a point
                    result.correctOptions.push(i);
                    result.score++;
                } else if (test.log[i] === true) {
                    // option was selected, but wrong
                    result.wrongOptions.push(i);
                }
            }
        } else if (test.config['category'] === 'multiple-options') {
            for (let i = 0; i < test.log.length; i++) {
                const testOptions = test.config['options'];
                const correctOption = testOptions[i]['correct'];
                if (test.log[i][correctOption] === true) {
                    // correct option was selected, award a point
                    result.correctOptions.push(i);
                    result.score++;
                } else {
                    for (const selection of test.log[i]) {
                        if (selection === true) {
                            // option was selected, but wrong
                            result.wrongOptions.push(i);
                            break;
                        }
                    }
                }
            }
        } else if (test.config['category'] === 'radio-buttons') {
            for (let i = 0; i < test.log.length; i++) {
                const testOptions = test.config['options'];
                const correctOption = testOptions[i]['correct'] === true ? true : false;
                if (test.log[i] === true && test.log[i] === correctOption) {
                    // correct option was selected, award a point
                    result.correctOptions.push(i);
                    result.score++;
                } else if (test.log[i] === true) {
                    // option was selected, but wrong
                    result.wrongOptions.push(i);
                }
            }
        } else if (test.config['category'] === 'speed') {
            for (let i = 0; i < test.log.length; i++) {
                const testOptions = test.config['options'];
                const correctOption = testOptions[i]['correct'];
                if (typeof test.log[i] !== 'string') {
                    // not a string -> not something we can evaluate
                    // this can occur when a user did not select any option in this test, in which
                    // case the log will record a 'false' value for the option
                    continue;
                }

                if (test.log[i].includes(correctOption)) {
                    // correct option was selected, award a point
                    result.correctOptions.push(i);
                    result.score++;
                } else if (test.log[i].length > 0) {
                    // option was selected, but wrong
                    result.wrongOptions.push(i);
                }
            }
        }

        tests.push(result);
    }

    return tests;
}

/**
 * Load results for a user (by pin).
 *
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
function load(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    // save the result to the database
    db.User.findOne({
        pin: bodyPin
    }).then(user => {
        if (!user) {
            logger.warn('No user for pin: ' + bodyPin);
            res.status(404).send();
            return;
        }

        logger.info('Loaded result for pin: ' + bodyPin);
        res.status(200).json(user.result.tests);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

/**
 * Lock results for a user (by pin).
 * This makes the result immutable to any further update API calls.
 *
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
async function lock(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);

    let course;
    let user;
    let courseConfig = null;

    // fetch the journal for the given pincode
    try {
        user = await db.User.findOne({
            pin: bodyPin
        });
    } catch(err) {
        logger.error(err);
        res.status(500).json({ error: err });
        return;
    }

    if (!user) {
        logger.warn('Could not find user for pin: ' + bodyPin);
        res.status(404).send();
        return;
    }

    // fetch the course config for the given pincode
    try {
        course = await db.Course.findOne({
            name: user.journal.structure.course
        });
    } catch(err) {
        logger.error(err);
        res.status(500).json({ error: err });
        return;
    }

    if (!course) {
        logger.warn('Could not find course: ' + user.journal.structure.course + ' for pin: ' +
                    bodyPin);
        res.status(404).send();
        return;
    }

    // get the config for the selected language
    for (const obj of course.configs) {
        if (obj.language === user.journal.structure.language) {
            courseConfig = obj.config;
            break;
        }
    }

    if (courseConfig === null) {
        logger.warn('Could not find course: ' + user.journal.structure.course + ' config for' +
                    ' language: ' + user.journal.structure.language);
        res.status(404).send();
        return;
    }

    // validation codes are immutable
    if (('validationCode' in user.result) && (user.result.validationCode)) {
        logger.warn('Validation code already generated for pin: ' + bodyPin +
                    ', using existing code');
        res.status(200).json(user.result.validationCode);
        return;
    }

    const validationCode = user.generateValidationCode(courseConfig['validationSchema']);

    db.User.updateOne({ pin: bodyPin }, {
        'result.validationCode': validationCode
    }, { upsert: false }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Locked and generated validation code for pin: ' + bodyPin);
        res.status(200).json(validationCode);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}

/**
 * Update results for a user (by pin).
 * If a result is locked (by calling the lock API), this returns an error.
 *
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
async function update(req, res) {
    const bodyPin = Number.parseInt(req.body.pin);
    let course;
    let user;
    let courseConfig = null;

    // fetch the user for the given pincode
    try {
        user = await db.User.findOne({
            pin: bodyPin
        });
    } catch(err) {
        logger.error(err);
        res.status(500).json({ error: err });
        return;
    }

    if (!user) {
        logger.warn('Could not find user for pin: ' + bodyPin);
        res.status(404).send();
        return;
    }

    // check whether the test results are frozen
    if (user.result.validationCode) {
        logger.warn('Results for pin: ' + bodyPin + ' are already locked, not updating them');
        // TODO: respond with error indicating that results are locked
        res.status(200).json(user.result.tests);
        return;
    }

    // fetch the course config for the given pincode
    try {
        course = await db.Course.findOne({
            name: user.journal.structure.course
        });
    } catch(err) {
        logger.error(err);
        res.status(500).json({ error: err });
        return;
    }

    if (!course) {
        logger.warn('Could not find course: ' + user.journal.structure.course + ' for pin: ' +
                    bodyPin);
        res.status(404).send();
        return;
    }

    // get the config for the selected language
    for (const obj of course.configs) {
        if (obj.language === user.journal.structure.language) {
            courseConfig = obj.config;
        }
    }

    if (courseConfig === null) {
        logger.warn('Could not find course: ' + user.journal.structure.course + ' config for' +
                    ' language: ' + user.journal.structure.language);
        res.status(404).send();
        return;
    }

    const testResults = calculate(courseConfig, user.journal);
    if (testResults === null) {
        res.status(404).send();
        return;
    }

    // save the result to the database
    db.User.updateOne({ pin: bodyPin }, {
        'result.lastChanged': new Date(),
        'result.tests': testResults
    }, { upsert: false }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Updated result for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: err });
    });
}
