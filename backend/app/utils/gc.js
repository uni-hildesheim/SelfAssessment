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
 */
function addTask(fn, params) {
    if (typeof fn !== 'function') {
        return false;
    }

    TASKS.push({
        fn: fn,
        params: params
    });
}

/**
 * Pause the GC engine.
 * @param {Number} delay Amount of seconds to wait before starting the GC engine again.
 */
function pause(delay) {
    stop();
    setTimeout( () => {
        start(SETTINGS.interval);
    }, delay * 1000);
}

/**
 * Start a garbage collection engine that runs every <interval> seconds.
 *
 * For now, it only removes stale user objects based on filter settings set in the environment.
 * Valid filters are:
 *      * GC_USER_LAST_UPDATE - Last update x days ago
 *      * GC_USER_DONE - Whether a validation code should exist
 *
 * @param {*} interval Number of seconds that must elapse before the GC engine runs.
 */
function start(interval) {
    // make sure engine is not running
    stop();

    SETTINGS.interval = interval * 1000;
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

module.exports = {
    addTask,
    pause,
    start,
    stop
}
