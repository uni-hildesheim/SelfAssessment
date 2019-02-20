const Ajv = require('ajv');

// load local dependencies
const logger = require('../../../utils/logger');
const AbstractTest = require('./abstract');

class MultipleOptionTest extends AbstractTest.class {
    constructor() {
        super(); // noop
        this.name = 'multiple-options';
        this.config = null;
    }

    static get schema() {
        // deep copy
        const schema = JSON.parse(JSON.stringify(AbstractTest.schema));

        /**
         * Schema for a multiple option test.
         *
         * ================
         * === REQUIRED ===
         * ================
         *
         * ----------------------------------------------------------------------------------------
         *   **           See AbstractTest.schema
         *                MultipleOption: 'correct' attribute is enforced and of type array with
         *                                integer members.
         * ----------------------------------------------------------------------------------------
         *   header       Array: list of option labels
         *                Only for multiple-options tests.
         *                For example, the header for a test with three options per task might look
         *                like the following:
         *                "header": [
         *                  "< 10",
         *                  "10",
         *                  "> 10"
         *                ]
         * ----------------------------------------------------------------------------------------
         */
        schema['$id'] = 'MultipleOptionTest';
        schema['properties']['options']['items']['properties']['correct'] = {"type": "integer"};
        schema['properties']['options']['items']['required'].push('correct');
        schema['properties']['header'] = {
            "type": "array",
            "items": {"type": "string"}
        };
        schema['required'].push('header');
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
        const validate = ajv.compile(MultipleOptionTest.schema);
        if (!validate(config)) {
            logger.warn('MultipleOptionTest: ' + JSON.stringify(validate.errors));
            return false;
        }

        this.config = config;
        return true;
    }
}

module.exports = {
    name: 'multiple-options',
    class: MultipleOptionTest,
    schema: MultipleOptionTest.schema
};
