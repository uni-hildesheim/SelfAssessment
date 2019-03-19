const logger = require('./logger');

/**
 * Hidden API (not exposed by the module) to get the caller file.
 * See: https://stackoverflow.com/a/14172822.
 */
function _getStack() {
    const originalFunc = Error.prepareStackTrace;
    let callerfile;
    let stack;

    try {
        const err = new Error();
        let currentfile;

        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };

        stack = err.stack.shift();
        currentfile = stack.getFileName();

        while (err.stack.length) {
            stack = err.stack.shift();
            callerfile = stack.getFileName();

            if (currentfile !== callerfile) {
                break;
            }
        }
    } catch (e) {
        // dummy
    }

    Error.prepareStackTrace = originalFunc; 
    return stack;
}

/**
 * Overseeable things.
 * For now, only functions are supported.
 */
const Overseeable = {
    UNKNOWN: 0,
    FUNCTION: 1,
    properties: {
        0: { string: "Unknown" },
        1: { string: "Function" }
    }
};

class OverseeableObject {
    /**
     * Object that can be tracked via an Overseer instance.
     * Initializes its type to 'Unknown' and really only serves as a base class.
     */
    constructor() {
        this.type = Overseeable.UNKNOWN;
    }
}

class OverseeableFunction extends OverseeableObject {
    /**
     * Function that can be tracked via an Overseer instance.
     * Tracks stats such as the function call count, execution time and more.
     * Unfortunately, callbacks etc executed inside those functions cannot be taken into account
     * because that's just not possible. Thus, function execution time is a metric to be taken with
     * a grain of salt.
     *
     * @param {function} target Function that can be tracked via an Overseer instance.
     */
    constructor(target) {
        super();
        this.type = Overseeable.FUNCTION;
        this.stats = {
            callCount: 0,
            callTimeMinNs: 0,
            callTimeMaxNs: 0,
            callTimeAvgNs: 0
        }

        // determine calling module properties
        this.name = target.name;
        this.module = _getStack().getFileName();
        this.originalFunc = target;
        this.wrapper = null;
    }

    /**
     * Wrap the function to track statistics such as call count, execution time etc.
     */
    wrap() {
        const originalFunc = this.originalFunc;
        const stats = this.stats;

        // reset stats
        this.stats.callCount = 0;
        this.stats.callTimeMinNs = 0;
        this.stats.callTimeMaxNs = 0;
        this.stats.callTimeAvgNs = 0;

        this.wrapper = function() {
            const start = process.hrtime();
            const ret = originalFunc.apply(null, arguments);
            const elapsed = process.hrtime(start);
            const callTimeNs = elapsed[0] * 1e9 /* s to ns */ + elapsed[1];

            // update stats
            stats.callCount++;
            // compute average with equal weight for each value
            stats.callTimeAvgNs = stats.callTimeAvgNs * ((stats.callCount-1) / stats.callCount)
                    + callTimeNs * (1 / stats.callCount);

            if (stats.callTimeMinNs > callTimeNs
                    || stats.callTimeMinNs === 0) {
                stats.callTimeMinNs = callTimeNs;
            }

            if (stats.callTimeMaxNs < callTimeNs) {
                stats.callTimeMaxNs = callTimeNs;
            }

            return ret;
        };

        return this.wrapper;
    }

    /**
     * Undo function wrapping, restoring the original function.
     * That means the wrapper will now point to the original function again.
     */
    unwrap() {
        if (this.wrapper !== null) {
            this.wrapper = this.originalFunc;
        }
    }
}

class Overseer {
    /**
     * Overseer object that can be used to track objects (and more specifically, functions).
     */
    constructor() {
        // map with module filenames as keys
        this.modules = {};
        // global options
        this.options = {
            enableWrapping: true
        }
    }

    /**
     * Wrap a JS function and create an OverseeableFunction instance, adding it to the internally
     * tracked list.
     *
     * @param {function} target Function that can be tracked via an Overseer instance.
     */
    wrapFunction(target) {
        if (!this.options.enableWrapping) {
            logger.debug('Overseer: wrapping disabled; not wrapping function: ' + target.name);
            return target;
        }

        logger.debug('Overseer: wrapping function: ' + target.name);
        const overseeable = new OverseeableFunction(target);

        // initialize properties if necessary
        if (!(overseeable.module in this.modules)) {
            this.modules[overseeable.module] = {
                // map with function names as keys
                functions: {}
            }
        }

        // add to observed modules
        this.modules[overseeable.module].functions[overseeable.name] = overseeable;
        return overseeable.wrap();
    }
}

/**
 * Create and expose a default overseer instance.
 * It enables class users to access an overseer without the need to create their own instance:
 * @example
 *   const overlord = require('overseer');
 *   overlord.wrapFunction(...);
 */
const overlord = new Overseer();

module.exports = {
    /* factory */
    create: (...args) => { return new Overseer(...args) },

    /* classes and data stores needed for public API */
    options: overlord.options,

    /* default instance methods */
    wrapFunction: (...args) => overlord.wrapFunction(...args)
}
