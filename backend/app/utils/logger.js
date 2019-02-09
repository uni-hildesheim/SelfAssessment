/**
 * Logging levels.
 * Depending on the level, messages are directed to stdout (ALL, INFO, WARN) or stderr (ERROR).
 */
const Level = {
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    ALL: 5,
    properties: {
        1: { string: "ERROR" },
        2: { string: "WARN" },
        3: { string: "INFO" },
        4: { string: "DEBUG" },
        5: { string: "ALL" }
    }
};

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

class Logger {
    constructor() {
        this.level = Level.ERROR;
        this.transports = [];
    }

    /**
     * A wrapper for console.{log, warn, error} with extended features such as timestamp printing.
     *
     * @param {Level} level The loglevel, indicating severity
     * @param {string} message The log message to display
     */
    log(level, message) {
        let logLevel = level;

        // don't just silently swallow messages for invalid log leves
        // - force level to ALL instead
        if (!(level in Level.properties)) {
            logLevel = Level.ALL;
        }

        if (this.level < logLevel) {
            return;
        }

        const date = new Date();
        const logLine = `[${Level.properties[logLevel].string}]` +
                        ` ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}` +
                        ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` +
                        ` ${message}`;

        for (const transport of this.transports) {    
            transport.log(logLevel, logLine);
        }
    }

    /*
     * Convenience wrappers with predefined log levels
     */

    /**
     * Call log(Level.ERROR, message)
     * @param {String} message 
     */
    error(message) {
        this.log(Level.ERROR, message);
    }

    /**
     * Call log(Level.ERROR, message)
     * @param {String} message 
     */
    warn(message) {
        this.log(Level.WARN, message);
    }

    /**
     * Call log(Level.ERROR, message)
     * @param {String} message 
     */
    info(message) {
        this.log(Level.INFO, message);
    }

    /**
     * Call log(Level.ERROR, message)
     * @param {String} message 
     */
    debug(message) {
        this.log(Level.DEBUG, message);
    }

    /**
     * Set a new log level, immediately affecting logging output.
     * Previous log output is not replayed.
     *
     * @param {Level} level The loglevel, indicating severity
     * @returns {boolean} true on success, false otherwise
     */
    setLogLevel(level) {
        // ignore invalid levels
        if (!(level in Level.properties)) {
            // in the past, we supported setting the string as level, so check that as well
            if (level in Level) {
                this.level = Level[level];
                return true;
            } else {
                return false;
            }
        }

        this.level = level;
        return true;
    }

    /**
     * Add a new transport for logging.
     *
     * @param {Transport} transport The log transport to use for logging 
     */
    addTransport(transport) {
        if (this.transports.length === 0) {
            this.transports.push(transport);
            return true;
        }

        if (this.transports[0].priority >= transport.priority) {
            // insert at the end
            this.transports.push(transport);
        } else {
            // insert at the beginning
            this.transports.splice(0, 0, transport);
        }
    }
}

/**
 * Create and expose a default logger instance.
 * It enables class users to access a logger without the need to create their own instance:
 * @example
 *   const logger = require('logger');
 *   logger.log(logger.levels.ERROR, 'some error');
 *   logger.error('another error');
 */
const defaultLogger = new Logger();

module.exports = {
    /* classes and data stores needed for public API */
    Level: Level,
    Transport: {
        ConsoleTransport,
        FileTransport
    },

    /* default instance methods */
    log: (...args) => defaultLogger.log(...args),
    setLogLevel: (...args) => defaultLogger.setLogLevel(...args),
    addTransport: (...args) => defaultLogger.addTransport(...args)
}
