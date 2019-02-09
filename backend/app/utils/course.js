const logger = require('./logger');

module.exports = {
    mergeConfigs
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
        // HACK: this function shall not alter its parameters, thus we have to resort to the old
        // JSON.parse(JSON.stringify(x)) hack to perform a deep copy of the object
        const objCopy = JSON.parse(JSON.stringify(obj));
        Object.assign(mergedConfig, objCopy);
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
