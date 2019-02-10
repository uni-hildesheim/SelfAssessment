const Ajv = require('ajv');
const mongoose = require('mongoose');

// load local dependencies
const logger = require('../utils/logger');

const CourseSchema = new mongoose.Schema({
    name: String,
    icon: String,
    configs: [{
        language: String,
        config: Object
    }]
});

const SINGLE_TEST_SCHEMA = {
    "$id": "/SingleTest",
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "type": {"type": "string"},
        "category": {
            "type": "string",
            "enum": ["checkbox", "multiple-options", "radio-buttons", "speed"]
        },
        "description": {"type": "string"},
        "task": {"type": "string"},
        "seconds": {"type": "integer"},
        "options": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "correct": {}
                }
            }
        },
        "header": {
            "type": "array",
            "items": {"type": "string"}
        },
        "evaluated": {"type": "boolean"},
    },
    "required": ["id", "type", "description", "task", "options", "evaluated"]
};

const TEST_GROUP_SCHEMA = {
    "$id": "/TestGroup",
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "tests": {
            "type": "array",
            "items": {"type": "integer"}
        },
        "select": {"type": "integer"},
    },
    "required": ["id", "tests"]
};

const TEST_SET_SCHEMA = {
    "$id": "/TestSet",
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "elements": {
            "type": "array",
            "items": {"type": "integer"}
        }
    },
    "required": ["id", "elements"]
};

const INFO_PAGE_SCHEMA = {
    "$id": "/InfoPage",
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "text": {"type": "string"},
        "belongs": {
            "type": "array",
            "items": {"type": "integer"}
        }
    },
    "required": ["id"]
};

const TEST_SCHEMA = {
    "$id": "/Test",
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "icon": {"type": "string"},
        "checksum_regex": {"type": "string"},
        "tests": {
            "type": "array",
            "items": {"$ref": "/SingleTest"}
        },
        "testgroups": {
            "type": "array",
            "items": {"$ref": "/TestGroup"}
        },
        "sets": {
            "type": "array",
            "items": {"$ref": "/TestSet"}
        },
        "infopages": {
            "type": "array",
            "items": {"$ref": "/InfoPage"}
        },
    },
    "required": ["title", "checksum_regex", "tests"]
};

/**
 * Validate a given JSON object against our internal config format scheme.
 * Returns true for valid configs, false otherwise.
 *
 * @param {JSON} config The config object as JSON
 */
CourseSchema.statics.validateConfig = function(config) {
    // 1. validate config against the pre-defined schemas
    const ajv = new Ajv();
    const validate = ajv.addSchema(SINGLE_TEST_SCHEMA).addSchema(TEST_GROUP_SCHEMA)
        .addSchema(TEST_SET_SCHEMA).addSchema(INFO_PAGE_SCHEMA).compile(TEST_SCHEMA);
    if (!validate(config)) {
        logger.log(logger.Level.WARN, JSON.stringify(validate.errors));
        return false;
    }

    // 2. check for valid single test attributes
    const tests = config['tests'];
    let testIDs = [];
    for (const test of tests) {
        // check whether the test ID is unique
        if (testIDs.indexOf(test['id']) > -1) {
            logger.log(logger.Level.WARN, 'CourseModel: validateConfig: "id" not unique: ' +
                       test['id']);
            return false;
        }

        // special case: multiple-options test
        // here, each "option" MUST have a "correct" attribute, specifying the index of the correct
        // option in the header
        if (test['category'] === 'multiple-options') {
            for (const option of test['options']) {
                if (!('correct' in option)) {
                    // abort, this is not a valid test definition
                    logger.log(logger.Level.WARN, 'CourseModel: validateConfig: multiple-options' + 
                               ' test: ' + test['id'] + ' requires the "correct" attribute for ' +
                               ' each option!');
                    return false;
                }
            }
        }

        // special case: speed test
        // here, each "option" MUST have a "correct" attribute, specifying the expected substring
        // to match against
        if (test['category'] === 'speed') {
            for (const option of test['options']) {
                if (!('correct' in option)) {
                    // abort, this is not a valid test definition
                    logger.log(logger.Level.WARN, 'CourseModel: validateConfig: speed test: ' +
                               test['id'] + ' requires the "correct" attribute for each option!');
                    return false;
                }
            }
        }

        // keep track of all single test IDs
        testIDs.push(test['id']);
    }

    // 3. check for valid testgroup definitions, if any
    const testgroups = config['testgroups'];
    let testgroupIDs = [];
    if (testgroups) {
        for (const group of testgroups) {
            // check whether the testgroup ID is unique
            if (testgroupIDs.indexOf(group['id']) > -1) {
                logger.log(logger.Level.WARN, 'CourseModel: validateConfig: "id" not unique: ' +
                           group['id']);
                return false;
            }

            // keep track of all testgroup IDs
            testgroupIDs.push(group['id']);

            // check whether the referenced tests exist
            const tests = group['tests'];
            for (const testID of tests) {
                if (testIDs.indexOf(testID) == -1) {
                    logger.log(logger.Level.WARN, 'CourseModel: validateConfig: testgroup' +
                               ' references element ID: ' + testID + ', which is unknown');
                    return false;
                }
            }
        }
    }

    // 4. check for valid set definitions, if any
    const testsets = config['sets'];
    let testsetIDs = [];
    if (testsets) {
        for (const set of testsets) {
            // check whether the testset ID is unique
            if (testsetIDs.indexOf(set['id']) > -1) {
                logger.log(logger.Level.WARN, 'CourseModel: validateConfig: "id" not unique: ' +
                           set['id']);
                return false;
            }

            // keep track of all testset IDs
            testsetIDs.push(set['id']);

            // check whether the referenced elements exist
            const elems = set['elements'];

            for (const elemID of elems) {
                if (testIDs.indexOf(elemID) == -1 && testgroupIDs.indexOf(elemID) == -1) {
                    logger.log(logger.Level.WARN, 'CourseModel: validateConfig: test set ' +
                               ' references element ID: ' + elemID + ', which is unknown');
                    return false;
                }
            }
        }
    }

    // 5. check for valid infopage definitions, if any
    const infopages = config['infopages'];
    let infopageIDs = [];
    if (infopages) {
        for (const page of infopages) {
            // check whether the infopage ID is unique
            if (infopageIDs.indexOf(page['id']) > -1) {
                logger.log(logger.Level.WARN, 'CourseModel: validateConfig: "id" not unique: ' +
                           page['id']);
                return false;
            }

            // keep track of all infopage IDs
            infopageIDs.push(page['id']);

            // check whether the referenced elements exist
            const elems = page['belongs'];
            if (elems) {
                for (const elemID of elems) {
                    if (testIDs.indexOf(elemID) == -1 && testgroupIDs.indexOf(elemID) == -1 &&
                        testsetIDs.indexOf(elemID) == -1) {
                        logger.log(logger.Level.WARN, 'CourseModel: validateConfig: infopage' +
                                   ' references element ID: ' + elemID + ', which is unknown');
                        return false;
                    }
                }
            }
        }
    }

    // looks like we're clear
    return true;
}

const CourseModel = mongoose.model('Course', CourseSchema);

module.exports = CourseModel;
