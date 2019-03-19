const nodemailer = require("nodemailer");
const logger = require('./logger');

const ReportType = {
    GENERIC: 'generic',
    DB: 'database'
}

class EmailTransport {
    /**
     * Email transport class, currently supporting only the nodemailer backend.
     * The constructor only takes a single argument, SMTP options are set via member functions.
     *
     * @param {string} recipient Email recipient formatted as string
     */
    constructor(recipient) {
        this.impl = null;
        this.mailOptions = {
            from: 'SelfAssessment backend',
            to: recipient,
            subject: 'Crash Report'
        }
    }

    /**
     * Configure SMTP options for the nodemailer backend.
     *
     * @param {string} host SMTP host
     * @param {number} port SMTP port
     * @param {object} auth SMTP authentication, consists of two properties, 'user' and 'pass'
     */
    configure(host, port, auth) {
        // create nodemailer instance
        this.impl = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port == 465 ? true : false,
            auth: auth
        });
    }

    /**
     * Verify configuration for the mailing backend.
     *
     * @returns true on success (valid config), false otherwise.
     */
    async verify() {
        if (this.impl === null) {
            return false;
        }

        try {
            await this.impl.verify();
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Send an Email via SMTP.
     *
     * @param {string} message Email text formatted as single string
     * @returns true on success, false otherwise.
     */
    async send(message) {
        const mail = {
            from: this.mailOptions.from,
            to: this.mailOptions.to,
            subject: this.mailOptions.subject,
            text: message
        }

        try {
            await this.impl.sendMail(mail);
            return true;
        } catch (err) {
            logger.warn('CrashReporter: Failed to send mail (' + err + ')');
            return false;
        }
    }
}

/**
 * Add an Email transport to the global list.
 *
 * @param {EmailTransport} transport SMTP nodemailer transport
 */
function addTransport(transport) {
    // only email transports are supported right now
    if (!(transport instanceof EmailTransport)) {
        return false;
    }

    TRANSPORTS.push(transport);
}

/**
 * Send a crash report to all active transports.
 *
 * @param {string} message Email text formatted as single string
 * @param {ReportType} type Report type, defaults to 'generic'
 */
function sendReport(message, type = ReportType.GENERIC) {
    const text = 'Type: ' + type + '\n\n' + 'Message: ' + message;
    for (const transport of TRANSPORTS) {
        transport.send(text);
    }
}

const TRANSPORTS = [];

module.exports = {
    /* data types and structures */
    ReportType,
    Transport: {
        EmailTransport
    },

    /* API */
    addTransport,
    sendReport
}
