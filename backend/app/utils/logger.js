/**
 * Logging levels.
 * Depending on the level, messages are directed to stdout (ALL, INFO, WARN) or stderr (ERROR).
 */
const Level = {
    ALL: 'ALL',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

module.exports = {
    Level: Level,
    log,
    setLogLevel,
    setLogFile
}

var LOGLEVEL = Level.ERROR;

/**
 * A wrapper for console.{log, warn, error} with extended features such as timestamp printing.
 *
 * @param {Level} level The loglevel, indicating severity
 * @param {string} message The log message to display
 */
function log(level, message) {
    if (level < LOGLEVEL) {
        return;
    }

    const date = new Date();
    let fn = console.log;
    if (level == Level.WARN) {
        fn = console.warn;
    } else if (level == Level.ERROR) {
        fn = console.error;
    }

    fn('[%s] %d-%d-%d %d:%d:%d %s', Level[level], date.getFullYear(), date.getMonth()+1,
        date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), message);
}

/**
 * Set a new log level, immediately affecting logging output.
 * Previous log output is not replayed.
 *
 * @param {Level} level The loglevel, indicating severity
 */
function setLogLevel(level) {
    if (!(level in Level)) {
        return false;
    }

    LOGLEVEL = level;
    return true;
}

/**
 * Pipe log messages to a file.
 * CURRENTLY NOT IMPLEMENTED!
 *
 * @param {string} file Path to a file where log output is written
 */
function setLogFile(file) { // eslint-disable-line no-unused-vars
    // TODO
}
