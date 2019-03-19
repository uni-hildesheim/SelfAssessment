const db = require('../../db/db');
const logger = require('../../utils/logger');
const courseTestModels = require('../course/testmodels');
const error = require('../../shared/error');

module.exports = {
    calculate,
    generateValidationCode,
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
        let testInstance = null;
        let result = {
            id: key,
            score: 0,
            maxScore: 0,
            correctOptions: [],
            wrongOptions: []
        }

        testInstance = courseTestModels.Factory.create(test.config['category'], test.config);
        if (testInstance === null) {
            logger.error('Failed to create test instance for: ' + test.config['category']);
            continue;
        }

        result.maxScore = testInstance.maxScore;

        const testResult = testInstance.calculateResult(test.log);
        result.score = testResult.score;
        result.correctOptions = testResult.correct;
        result.wrongOptions = testResult.wrong;

        tests.push(result);
    }

    return tests;
}

/**
 * Generate a validation code for a given schema.
 *
 * @param {String} schema schema containing a number or valid tokens
 * @returns Validation code as string (elements of schema that are unknown are not replaced) 
 */
function generateValidationCode(schema) {
    let code = schema;
    // tokens that need to be parsed and handled individually
    const metaTokens = ['%', '(', ')'];
    // tokens which can be replaced
    const regexTokens = ['[0-9]', '[A-Z]', '[a-z]'];
    // valid characters for token replacement
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // capture group
    let captureGroup = {
        start: -1,
        end: -1,
        string: ''
    };

    let token;
    let tokenIndex;

    // scan for regex tokens and handle them
    do {
        token = '';
        tokenIndex = -1;

        for (let i = 0; i < code.length; i++) {
            for (const regexToken of regexTokens) {
                if (code.substr(i, regexToken.length) === regexToken) {
                    token = regexToken;
                    tokenIndex = i;
                    // break out of outer loop as well
                    i = code.length;
                    break;
                }
            }
        }

        if (tokenIndex === -1) {
            // no token found in code, bail out
            break;
        }

        let replacement = '';

        if (token === '[0-9]') {
            replacement = Math.floor(Math.random() * 10);
        } else if (token === '[A-Z]') {
            const index = Math.floor(Math.random() * alphabet.length);
            replacement = alphabet.substring(index, index+1);
        } else if (token === '[a-z]') {
            const index = Math.floor(Math.random() * alphabet.length);
            replacement = alphabet.substring(index, index+1).toLowerCase();
        }

        // perform the actual replacement
        code = code.replace(token, () => { return replacement; });
    } while (tokenIndex > -1);

    // scan for meta tokens and handle them
    do {
        token = '';
        tokenIndex = -1;

        for (let i = 0; i < code.length; i++) {
            for (const metaToken of metaTokens) {
                if (code.substr(i, metaToken.length) === metaToken) {
                    token = metaToken;
                    tokenIndex = i;
                    // break out of outer loop as well
                    i = code.length;
                    break;
                }
            }
        }

        if (tokenIndex === -1) {
            // no token found in code, bail out
            break;
        }

        // handle token
        if ((token === '%') && (tokenIndex < code.length-1)) {
            // modulo means: we take the most recent capture group, sum all the Unicode char
            // codes at each position (if it's a char) or the number (if it's a number) and
            // compute the modulo with the given operator from the schema
            const moduloOperand = code.substr(tokenIndex+1, tokenIndex+2);
            let moduloResult = 0;

            if (captureGroup.string.length > 0) {
                let number = 0;
                for (let j = 0; j < captureGroup.string.length; j++) {
                    number += captureGroup.string.charCodeAt(j);
                }

                try {
                    moduloResult = Number.parseInt(number) % Number.parseInt(moduloOperand);
                } catch (err) {
                    // swallow
                }

                // reset captureGroup properties
                captureGroup.start = -1;
                captureGroup.end = -1;
                captureGroup.string = '';
            } else {
                logger.warn('Missing or malformed capture group for modulo operator in'
                            + ' schema: ' + schema + ', forcing 0 as modulo result');
            }

            // replace token
            code = code.replace(token + moduloOperand, () => { return moduloResult; });
        } else if (token === '(') {
            captureGroup.start = tokenIndex;
            code = code.replace(token, '');
        } else if (token === ')') {
            captureGroup.end = tokenIndex;
            if (captureGroup.end > captureGroup.start) {
                captureGroup.string = code.substring(captureGroup.start, captureGroup.end);
            }
            code = code.replace(token, '');
        }
    } while (tokenIndex > -1);

    return code;
}

/**
 * Express.js controller.
 * Load the results for a given user (pin) and return them in the response object.
 * HTTP 200 will be set on success, HTTP 404 if no result object exists for the user,
 * HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
function load(req, res, next) {
    const bodyPin = Number.parseInt(req.body.pin);

    // save the result to the database
    db.User.findOne({
        pin: bodyPin
    }).then(user => {
        if (!user) {
            logger.warn('No user for pin: ' + bodyPin);
            res.status(404).json({ error: error.ServerError.E_DBQUERY });
            return;
        }

        logger.info('Loaded result for pin: ' + bodyPin);
        res.status(200).json(user.result.tests);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}

/**
 * Express.js controller.
 * Lock results for a user (by pin).
 * This makes the result immutable to any further update API calls.
 * HTTP 200 will be set on success, HTTP 404 if the user or the course do not exist,
 * HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
async function lock(req, res, next) {
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
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
        return;
    }

    if (!user) {
        logger.warn('Could not find user for pin: ' + bodyPin);
        res.status(404).json({ error: error.ServerError.E_DBQUERY });
        return;
    }

    // fetch the course config for the given pincode
    try {
        course = await db.Course.findOne({
            name: user.journal.structure.course
        });
    } catch(err) {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
        return;
    }

    if (!course) {
        logger.warn('Could not find course: ' + user.journal.structure.course + ' for pin: ' +
                    bodyPin);
        res.status(404).json({ error: error.ServerError.E_DBQUERY });
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
        res.status(404).json({ error: error.ServerError.E_DBQUERY });
        return;
    }

    // validation codes are immutable
    if (('validationCode' in user.result) && (user.result.validationCode)) {
        logger.warn('Validation code already generated for pin: ' + bodyPin +
                    ', using existing code');
        res.status(200).json(user.result.validationCode);
        return;
    }

    const validationCode = generateValidationCode(courseConfig['validationSchema']);

    db.User.updateOne({ pin: bodyPin }, {
        'result.validationCode': validationCode
    }, { upsert: false }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Locked and generated validation code for pin: ' + bodyPin);
        res.status(200).json(validationCode);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}

/**
 * Express.js controller.
 * Update results for a user (by pin).
 * If a result is locked (by calling the lock API), this returns an error.
 * HTTP 200 will be set on success, HTTP 404 if the user or the course do not exist,
 * HTTP 500 otherwise.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @param {*} next ...
 */
async function update(req, res, next) {
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
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
        return;
    }

    if (!user) {
        logger.warn('Could not find user for pin: ' + bodyPin);
        res.status(404).json({ error: error.ServerError.E_DBQUERY });
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
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
        return;
    }

    if (!course) {
        logger.warn('Could not find course: ' + user.journal.structure.course + ' for pin: ' +
                    bodyPin);
        res.status(404).json({ error: error.ServerError.E_DBQUERY });
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
        res.status(404).json({ error: error.ServerError.E_DBQUERY });
        return;
    }

    const testResults = calculate(courseConfig, user.journal);
    if (testResults === null) {
        res.status(404).json({ error: error.ServerError.E_DBQUERY });
        return;
    }

    // save the result to the database
    db.User.updateOne({ pin: bodyPin }, {
        'result.tests': testResults
    }, { upsert: false }).then(result => { // eslint-disable-line no-unused-vars
        logger.info('Updated result for pin: ' + bodyPin);
        res.status(200).send();
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ error: error.ServerError.E_DBIO });
        next(err);
    });
}
