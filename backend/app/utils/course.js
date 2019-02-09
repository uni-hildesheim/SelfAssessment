const Ajv = require('ajv');
const logger = require('./logger');

module.exports = {
    mergeConfigs,
    validateConfig
}

/**
 * Merge two or more JSON files into one, using our internal reference resolving engine.
 * To reference an element, use
 *
 *   ?ref{1001-1}
 *
 * where 1000-1 is the ID of the references object.
 * One of the other input JSON files should then declare the referenced object as follows:
 *
 *   "1001-1": "This is a simple radio-buttons test."
 *
 * @param {Array} input Array of input JSON objects to merge
 * @returns {JSON} A single merged JSON object on success, null otherwise
 */
function mergeConfigs(input) {
    let references = {};
    let mergedConfig = {};

    // 1. collect all references
    for (const obj of input) {
        if (!('?refs' in obj)) {
            // no refs here, skip to the next file
            continue;
        }

        for (const ref in obj['?refs']) {
            if (ref in references) {
                logger.log(logger.Level.WARN, 'mergeConfigs: Duplicate ref: ' + ref + ', but all' +
                           'refs must be unique');
                return null;
            }

            references[ref] = obj['?refs'][ref];
        }

        // finally, remove the references from the object
        delete obj['?refs'];
    }

    // 2. merge all input objects
    for (const obj of input) {
        Object.assign(mergedConfig, obj);
    }

    // 3. resolve references

    /**
     * Resolve references recursively, checking all values of keys and values of sublevel keys.
     *
     * @param {JSON} input JSON object
     * @param {Object} references Object containing references as key-value map
     * @returns {boolean} true if all references were resolved, false otherwise
     */
    function resolveReferences(input, references) {
        for (const key in input) {
            if (key.includes('?ref')) {
                logger.log(logger.Level.WARN, 'mergeConfigs: keys must not contain references');
                return false;
            }

            const value = input[key];
            logger.log(logger.Level.DEBUG, 'mergeConfigs: resolveReferences: key: ' + key);

            // if value is an array or an object, loop through it and resolve refs for each member
            if (value instanceof Array) {
                logger.log(logger.Level.DEBUG, 'mergeConfigs: resolveReferences: looks like' +
                           ' value is an array');
                for (const member of value) {
                    if (!resolveReferences(member, references)) {
                        return false;
                    }
                }
            } else if (typeof value === 'object') {
                logger.log(logger.Level.DEBUG, 'mergeConfigs: resolveReferences: looks like' +
                           ' value is an object');
                if (!resolveReferences(value, references)) {
                    return false;
                }
            }

            // references must be (part of) strings
            if (typeof(value) !== 'string' && !(value instanceof String)) {
                continue;
            }

            if (!value.includes('?ref')) {
                // nothing to see here, move on
                continue;
            }

            logger.log(logger.Level.DEBUG, 'mergeConfigs: resolveReferences: found ?ref keyword' +
                       + ' in value: ' + value);

            // replace the ref
            const refStart = value.indexOf('?ref{');
            const refEnd = value.indexOf('}', refStart);
            if (refStart === -1 || refEnd === -1) {
                logger.log(logger.Level.WARN, 'mergeConfigs: Failed to parse ref name from' +
                           ' value: ' + value);
                return false;
            }

            // refStart needs to be offset by 5 (length of '?ref{')
            const refName = value.substring(refStart+5, refEnd);
            logger.log(logger.Level.DEBUG, 'mergeConfigs: resolveReferences: ref name: ' +
                       refName);

            if (!(refName in references)) {
                logger.log(logger.Level.WARN, 'mergeConfigs: Failed to resolve ref: ' + refName);
                return false;
            }

            // perform the actual string replacement
            const refString = value.substring(refStart, refEnd+1);
            logger.log(logger.Level.DEBUG, 'mergeConfigs: resolveReferences: resolving: ' +
                       refString + ' to: ' + references[refName]);
            input[key] = value.replace(refString, () => { return references[refName] });
        }

        return true;
    }

    // we need to iterate through all the keys, including subkeys of the mergedConfig object
    if (!resolveReferences(mergedConfig, references)) {
        return null;
    }

    // we tried our best to validate the components, let it pass
    return mergedConfig;
}

/**
 * Validate a given JSON object against our internal config format scheme.
 * Returns true for valid configs, false otherwise.
 *
 * @param {JSON} config The config object as JSON
 */
function validateConfig(config) {
    // 1. define schemas to validate against
    const singleTestSchema = {
        "$id": "/SingleTest",
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "type": {"type": "string"},
            "category": {"type": "string"},
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
    const testGroupSchema = {
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
    const testSetSchema = {
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
    const infoPageSchema = {
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
    const testSchema = {
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

    // 2. validate config against the schema
    const ajv = new Ajv();
    const validate = ajv.addSchema(singleTestSchema).addSchema(testGroupSchema)
        .addSchema(testSetSchema).addSchema(infoPageSchema).compile(testSchema);
    if (!validate(config)) {
        logger.log(logger.Level.WARN, JSON.stringify(validate.errors));
        return false;
    }

    // 3. check for valid single test attributes
    const tests = config['tests'];
    let testIDs = [];
    for (const test of tests) {
        // check whether the test ID is unique
        if (testIDs.indexOf(test['id']) > -1) {
            logger.log(logger.Level.WARN, 'validateConfig: "id" not unique: ' + test['id']);
            return false;
        }

        // special case: multiple-options test
        // here, each "option" MUST have a "correct" attribute, specifying the index of the correct
        // option in the header
        if (test['category'] === 'multiple-options') {
            for (const option of test['options']) {
                if (!('correct' in option)) {
                    // abort, this is not a valid test definition
                    logger.log(logger.Level.WARN, 'validateConfig: multiple-options test: ' +
                               test['id'] + ' requires the "correct" attribute for each option!');
                    return false;
                }
            }
        }

        // keep track of all single test IDs
        testIDs.push(test['id']);
    }

    // 4. check for valid testgroup definitions, if any
    const testgroups = config['testgroups'];
    let testgroupIDs = [];
    if (testgroups) {
        for (const group of testgroups) {
            // check whether the testgroup ID is unique
            if (testgroupIDs.indexOf(group['id']) > -1) {
                logger.log(logger.Level.WARN, 'validateConfig: "id" not unique: ' + group['id']);
                return false;
            }

            // keep track of all testgroup IDs
            testgroupIDs.push(group['id']);

            // check whether the referenced tests exist
            const tests = group['tests'];
            for (const testID of tests) {
                if (testIDs.indexOf(testID) == -1) {
                    logger.log(logger.Level.WARN, 'validateConfig: testgroup references element' +
                        ' ID: ' + testID + ', which is unknown');
                    return false;
                }
            }
        }
    }

    // 5. check for valid set definitions, if any
    const testsets = config['sets'];
    let testsetIDs = [];
    if (testsets) {
        for (const set of testsets) {
            // check whether the testset ID is unique
            if (testsetIDs.indexOf(set['id']) > -1) {
                logger.log(logger.Level.WARN, 'validateConfig: "id" not unique: ' + set['id']);
                return false;
            }

            // keep track of all testset IDs
            testsetIDs.push(set['id']);

            // check whether the referenced elements exist
            const elems = set['elements'];

            for (const elemID of elems) {
                if (testIDs.indexOf(elemID) == -1 && testgroupIDs.indexOf(elemID) == -1) {
                    logger.log(logger.Level.WARN, 'validateConfig: testset references element' +
                        ' ID: ' + elemID + ', which is unknown');
                    return false;
                }
            }
        }
    }

    // 6. check for valid infopage definitions, if any
    const infopages = config['infopages'];
    let infopageIDs = [];
    if (infopages) {
        for (const page of infopages) {
            // check whether the infopage ID is unique
            if (infopageIDs.indexOf(page['id']) > -1) {
                logger.log(logger.Level.WARN, 'validateConfig: "id" not unique: ' + page['id']);
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
                        logger.log(logger.Level.WARN, 'validateConfig: infopage references' +
                            ' element ID: ' + elemID + ', which is unknown');
                        return false;
                    }
                }
            }
        }
    }

    // looks like we're clear
    return true;
}
