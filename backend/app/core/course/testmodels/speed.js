const Ajv = require('ajv');

// load local dependencies
const logger = require('../../../utils/logger');
const AbstractTest = require('./abstract');

class SpeedTest extends AbstractTest.class {
    constructor() {
        super(); // noop
        this.name = 'speed';
        this.config = null;
    }

    static get schema() {
        // deep copy
        const schema = JSON.parse(JSON.stringify(AbstractTest.schema));

        /**
         * Schema for a speed test.
         *
         * ================
         * === REQUIRED ===
         * ================
         *
         * ----------------------------------------------------------------------------------------
         *   **           See AbstractTest.schema
         *                SpeedTest: 'correct' attribute is enforced and of type string.
         * ----------------------------------------------------------------------------------------
         *   seconds      Integer: processing time before the test is locked down
         *                Only for speed tests.
         * ----------------------------------------------------------------------------------------
         */
        schema['$id'] = 'RadioButtonTest';
        schema['properties']['options']['items']['properties']['correct'] = {"type": "string"};
        schema['properties']['options']['items']['required'].push('correct');
        schema['properties']['seconds'] = {"type": "integer"};
        schema['required'].push('seconds');
        return schema;
    }

    /**
     * Load test configuration from a JSON object.
     *
     * @param {String} config JSON config object
     * @returns true on success, false otherwise
     */
    loadConfig(config) {
        const ajv = new Ajv();
        const validate = ajv.addSchema(this.schema);
        if (!validate(config)) {
            logger.warn('SpeedTest: ' + JSON.stringify(validate.errors));
            return false;
        }

        this.config = config;
    }
}

module.exports = {
    name: 'speed',
    class: SpeedTest,
    schema: SpeedTest.schema
};
