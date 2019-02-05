const fs = require('fs');

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

/* Default settings */
var SETTINGS = {
    level: Level.ERROR,
    fileStream: null,
    fileStreamBufferSize: 0
}

var BUFFER = []

/*
 * Logging colors for terminal output.
 * See: https://stackoverflow.com/a/41407246.
 */
const Color = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',

    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',

    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m'
}

/**
 * A wrapper for console.{log, warn, error} with extended features such as timestamp printing.
 *
 * @param {Level} level The loglevel, indicating severity
 * @param {string} message The log message to display
 */
function log(level, message) {
    if (level < SETTINGS.level) {
        return;
    }

    const date = new Date();
    let fn = console.log;
    let color = Color.FgGreen;

    // determine logging function and color if necessary
    if (level == Level.WARN) {
        fn = console.warn;
        color = Color.FgYellow;
    } else if (level == Level.ERROR) {
        fn = console.error;
        color = Color.FgRed;
    }

    const logLine = `[${Level[level]}]` +
                    ` ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}` +
                    ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` +
                    ` ${message}`;
    const coloredLogLine = `${color}${logLine}${Color.Reset}`;

    // log to console-based transport
    fn(coloredLogLine);

    // log to file-based transport
    if (SETTINGS.fileStream) {
        if (BUFFER.length < SETTINGS.fileBufferSize) {
            // fill log buffer
            BUFFER.push(logLine);
        } else {
            if (SETTINGS.fileStreamBufferSize == 0) {
                // bypass buffering, directly write to console
                SETTINGS.fileStream.write(logLine + '\n');
            } else {
                // clear the buffer, write everything to console
                for (const line of BUFFER) {
                    SETTINGS.fileStream.write(line + '\n');
                }
                BUFFER = [];
            }
        }
    }
}

/**
 * Set a new log level, immediately affecting logging output.
 * Previous log output is not replayed.
 *
 * @param {Level} level The loglevel, indicating severity
 */
function setLogLevel(level) {
    // ignore invalid levels
    if (!(level in Level)) {
        return false;
    }

    SETTINGS.level = level;
    return true;
}

/**
 * Pipe log messages to a file.
 *
 * @param {string} filePath Path to a file where log output is written
 * @param {number} bufferSize Number of lines to buffer before the log is written to the file
 */
function setLogFile(filePath, bufferSize = 0) {
    if (filePath === null) {
        SETTINGS.filePath = null;
        return false;
    }

    // sanity check: bufferSize must not be smaller than 0
    if (bufferSize < 0) {
        bufferSize = 0;
    }

    SETTINGS.fileStream = fs.createWriteStream(
        filePath,
        {
            'flags': 'w'
        }
    );

    SETTINGS.fileStream.on('error', (err) => {
        log(Level.ERROR, "Failed to create logger file-based transport: " + err);
        SETTINGS.fileStream.end();
        return false;
    });

    SETTINGS.fileBufferSize = bufferSize;
    return true;
}
