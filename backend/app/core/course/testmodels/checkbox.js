const Ajv = require('ajv');

// load local dependencies
const logger = require('../../../utils/logger');
const AbstractTest = require('./abstract');

class CheckboxTest extends AbstractTest.class {
    constructor() {
        super(); // noop
        this.name = 'checkbox';
        this.config = null;
    }

    static get schema() {
        // deep copy
        const schema = JSON.parse(JSON.stringify(AbstractTest.schema));

        /**
         * Schema for a checkbox test.
         *
         * ================
         * === REQUIRED ===
         * ================
         *
         * ----------------------------------------------------------------------------------------
         *   **           See AbstractTest.schema
         *                Checkbox: 'correct' attribute is of type boolean.
         * ----------------------------------------------------------------------------------------
         */
        schema['$id'] = 'CheckboxTest';
        schema['properties']['category'] = {"const": "checkbox"};
        schema['properties']['options']['items']['properties']['correct'] = {"type": "boolean"};
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
        const validate = ajv.compile(CheckboxTest.schema);
        if (!validate(config)) {
            logger.warn('CheckboxTest: ' + JSON.stringify(validate.errors));
            return false;
        }

        this.config = config;
        return true;
    }
}

module.exports = {
    name: 'checkbox',
    class: CheckboxTest,
    schema: CheckboxTest.schema
};
