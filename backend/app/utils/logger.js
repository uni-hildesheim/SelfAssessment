/**
 * Logging levels.
 * Depending on the level, messages are directed to stdout (ALL, INFO, WARN) or stderr (ERROR).
 */
const Level = {
    ALL: 'ALL',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

class ConsoleTransport {
    constructor(priority = 1) {
        this.priority = priority;
    }
    log(level, message) {
        let fn = console.log;
        let color = '';
    
        // determine logging function and color if necessary
        if (level == Level.WARN) {
            fn = console.warn;
            color = Color.FgYellow;
        } else if (level == Level.ERROR) {
            fn = console.error;
            color = Color.FgRed;
        }

        const line = `${color}${message}${Color.Reset}`
        fn(line);
    }
}

class FileTransport {
    constructor(priority = 1, fileStream) {
        this.priority = priority;
        this.fileStream = fileStream;
    }
    log(level, message) {
        this.fileStream.write(message + '\n');
    }
}

/* Default settings */
var SETTINGS = {
    level: Level.ERROR
};

var TRANSPORTS = [];

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
};

/**
 * A wrapper for console.{log, warn, error} with extended features such as timestamp printing.
 *
 * @param {Level} level The loglevel, indicating severity
 * @param {string} message The log message to display
 */
function log(level, message) {
    let logLevel = level;

    // don't just silently swallow messages for invalid log leves
    // - force level to ALL instead
    if (!(level in Level)) {
        logLevel = Level.ALL;
    }

    if (level < SETTINGS.level) {
        return;
    }

    const date = new Date();
    const logLine = `[${Level[logLevel]}]` +
                    ` ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}` +
                    ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` +
                    ` ${message}`;

    for (const transport of TRANSPORTS) {    
        transport.log(logLevel, logLine);
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
 * Add a new transport for logging.
 *
 * @param {Transport} transport The log transport to use for logging 
 */
function addTransport(transport) {
    if (TRANSPORTS.length === 0) {
        TRANSPORTS.push(transport);
        return true;
    }

    if (TRANSPORTS[0].priority >= transport.priority) {
        // insert at the end
        TRANSPORTS.push(transport);
    } else {
        // insert at the beginning
        TRANSPORTS.splice(0, 0, transport);
    }
}

module.exports = {
    Level: Level,
    ConsoleTransport,
    FileTransport,
    log,
    setLogLevel,
    addTransport
}
