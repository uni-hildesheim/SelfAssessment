const Ajv = require('ajv');

// load local dependencies
const logger = require('../../../utils/logger');
const AbstractTest = require('./abstract');

class RadioButtonTest extends AbstractTest.class {
    constructor() {
        super(); // noop
        this.name = 'radio-buttons';
        this.config = null;
    }

    static get schema() {
        // deep copy
        const schema = JSON.parse(JSON.stringify(AbstractTest.schema));

        /**
         * Schema for a radio button test.
         *
         * ================
         * === REQUIRED ===
         * ================
         *
         * ----------------------------------------------------------------------------------------
         *   **           See AbstractTest.schema
         *                RadioButton: 'correct' attribute is of type boolean.
         * ----------------------------------------------------------------------------------------
         */
        schema['$id'] = 'RadioButtonTest';
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
        const validate = ajv.addSchema(this.schema);
        if (!validate(config)) {
            logger.warn('RadioButtonTest: ' + JSON.stringify(validate.errors));
            return false;
        }

        this.config = config;
    }
}

module.exports = {
    name: 'radio-buttons',
    class: RadioButtonTest,
    schema: RadioButtonTest.schema
};
