const logger = require('./logger');

const TASKS = [];
let RUNNER;
let SETTINGS = {
    /* amount of seconds to pass before the GC engine runs */
    interval: 0
}

/**
 * Add a new GC task to be executed when the GC engine is triggered.
 * @param {function} fn Function to run.
 * @param {*} params Function parameters.
 * @returns true on success, false if fn is not a function object
 */
function addTask(fn, params) {
    if (typeof fn !== 'function') {
        return false;
    }

    TASKS.push({
        fn: fn,
        params: params
    });

    return true;
}

/**
 * Remove a function from the internal task list.
 * @param {function} fn Function to run.
 * @returns true on success, false if fn was not found
 */
function removeTask(fn) {
    let index = -1;

    for (let i = 0; i < TASKS.length; i++) {
        // must be the same memory location, thus '==='
        if (TASKS[i].fn === fn) {
            index = i;
        }
    }

    if (index === -1) {
        return false;
    }

    // remove from task list
    TASKS.splice(index, 1);

    return true;
}

/**
 * Pause the GC engine.
 * @param {Number} delay Milliseconds to wait before starting the GC engine again.
 */
function pause(delay) {
    stop();
    setTimeout( () => {
        start(SETTINGS.interval);
    }, delay);
}

/**
 * Start a garbage collection engine that runs every <interval> milliseconds.
 *
 * For now, it only removes stale user objects based on filter settings set in the environment.
 * Valid filters are:
 *      * GC_USER_LAST_UPDATE - Last update x days ago
 *      * GC_USER_DONE - Whether a validation code should exist
 *
 * @param {number} interval Milliseconds that must elapse before the GC engine runs.
 */
function start(interval) {
    // make sure engine is not running
    stop();

    SETTINGS.interval = interval;
    RUNNER = setInterval( () => {
        logger.debug('GC: Fired, executing tasks now');
        for (const task of TASKS) {
            try {
                task.fn(task.params);
            } catch (err) {
                // swallow
            }
        }
    }, SETTINGS.interval);
}

/**
 * Stop the GC engine.
 */
function stop() {
    clearInterval(RUNNER);
}

/**
 * Reset the GC engine, stopping it and clearing its task list.
 */
function reset() {
    stop();

    // delete everything in the array and destroy references
    TASKS.length = 0;
}

module.exports = {
    addTask,
    removeTask,
    pause,
    start,
    stop,
    reset
}
