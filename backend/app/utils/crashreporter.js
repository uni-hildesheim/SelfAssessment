const nodemailer = require("nodemailer");
const logger = require('./logger');

const ReportType = {
    GENERIC: 'generic',
    DB: 'database'
}

class EmailTransport {
    constructor(recipient) {
        this.impl = null;
        this.mailOptions = {
            from: 'SelfAssessment backend',
            to: recipient,
            subject: 'Crash Report'
        }
    }

    configure(host, port, auth) {
        // create nodemailer instance
        this.impl = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port == 465 ? true : false,
            auth: auth
        });
    }

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

function addTransport(transport) {
    // only email transports are supported right now
    if (!(transport instanceof EmailTransport)) {
        return false;
    }

    TRANSPORTS.push(transport);
}

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
