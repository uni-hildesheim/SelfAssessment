const logger = require('./logger');

module.exports = {
    mergeObjects,
    resolveReferencesinString,
    resolveReferences
}

/**
 * Merge two or more JSON objects into one, using our internal reference resolving engine.
 * To reference an element, use
 *
 *   ?ref{1001-1}
 *
 * where 1000-1 is the ID of the references object.
 * One of the other input JSON objects should then declare the referenced object as follows:
 *
 *   "1001-1": "This is a simple radio-buttons test."
 *
 * @param {Array} input Array of input JSON objects to merge
 * @returns {JSON} A single merged JSON object on success, null otherwise
 */
function mergeObjects(input) {
    let references = {};
    let mergedConfig = {};

    // 1. collect all references
    for (const obj of input) {
        if (!('?refs' in obj)) {
            // no refs here, skip to the next object
            continue;
        }

        for (const ref in obj['?refs']) {
            if (ref in references) {
                logger.warn('mergeConfigs: Duplicate ref: ' + ref + ', but all refs must be' +
                            ' unique');
                return null;
            }

            references[ref] = obj['?refs'][ref];
        }

        // finally, remove the references from the object
        delete obj['?refs'];
    }

    // 2. merge all input objects
    for (const obj of input) {
        // HACK: this function shall not alter its parameters, thus we have to resort to the old
        // JSON.parse(JSON.stringify(x)) hack to perform a deep copy of the object
        const objCopy = JSON.parse(JSON.stringify(obj));
        Object.assign(mergedConfig, objCopy);
    }

    // 3. resolve references
    // we need to iterate through all the keys, including subkeys of the mergedConfig object
    if (!resolveReferences(mergedConfig, references)) {
        return null;
    }

    // we tried our best to validate the components, let it pass
    return mergedConfig;
}

/**
 * Resolve multiple references in a single string.
 *
 * @param {String} input Input string to perform replacements on
 * @param {Object} references Object containing references as key-value map
 * @returns {String} Output string where references have been resolved
 */
function resolveReferencesinString(input, references) {
    let inputString = input;
    let refStart;
    let refEnd;

    if (typeof(inputString) !== 'string') {
        return false;
    }

    do {
        refStart = inputString.indexOf('?ref{');
        refEnd = inputString.indexOf('}', refStart);

        if (refStart >= 0 && refEnd === -1) {
            logger.warn('mergeConfigs: Failed to parse ref name from input: ' + input);
            break;
        }

        if (refStart === -1) {
            // no more refs to resolve
            break;
        }

        // refStart needs to be offset by 5 (length of '?ref{')
        const refName = inputString.substring(refStart+5, refEnd);
        logger.debug('mergeConfigs: resolveReferences: ref name: ' + refName);

        if (!(refName in references)) {
            logger.warn('mergeConfigs: Failed to resolve ref: ' + refName);
            break;
        }

        // perform the actual string replacement
        const refString = inputString.substring(refStart, refEnd+1);
        logger.debug('mergeConfigs: resolveReferences: resolving: ' + refString + ' to: ' +
                        references[refName]);
        inputString = inputString.replace(refString, () => { return references[refName] });
    } while (refStart !== -1 && refEnd !== -1);

    return inputString;
}

/**
 * Resolve references recursively, checking all values of keys and values of sublevel keys.
 *
 * @param {JSON} input JSON object
 * @param {Object} references Object containing references as key-value map
 * @returns {boolean} true if all references were resolved, false otherwise
 */
function resolveReferences(input, references) {
    for (let key in input) {
        if (key.includes('?ref')) {
            logger.warn('mergeConfigs: keys must not contain references');
            return false;
        }

        let value = input[key];
        logger.debug('mergeConfigs: resolveReferences: key: ' + key);

        // if value is an array or an object, loop through it and resolve refs for each member
        if (value instanceof Array) {
            logger.debug('mergeConfigs: resolveReferences: looks like value is an array');
            for (let i = 0; i < value.length; i++) {
                // XX: explicitly check for single string members in arrays so those are resolved
                // we should really have a better way to do this in the future (TODO)
                if (typeof(value[i]) === 'string') {
                    value[i] = resolveReferencesinString(value[i], references);
                    if (value[i].includes('?ref')) {
                        return false;
                    }
                } else if (!resolveReferences(value[i], references)) {
                    return false;
                }
            }
        } else if (typeof value === 'object') {
            logger.debug('mergeConfigs: resolveReferences: looks like value is an object');
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

        logger.debug('mergeConfigs: resolveReferences: found ?ref keyword in value: ' + value);

        // replace the ref
        value = resolveReferencesinString(value, references);
        if (value.includes('?ref')) {
            logger.warn('mergeConfigs: Could not resolve all references in string: ' + input[key]);
            return false;
        }

        input[key] = value;
    }

    return true;
}
