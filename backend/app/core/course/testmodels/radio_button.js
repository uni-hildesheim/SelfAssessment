const Ajv = require('ajv');

// load local dependencies
const logger = require('../../../utils/logger');
const AbstractTest = require('./abstract');

class RadioButtonTest extends AbstractTest {
    constructor(config) {
        super(config); // noop
        this.config = config;

        if (!this.loadConfig(config)) {
            throw new Error('Invalid test config');
        }
    }

    /**
     * Get the name of this test. Should always match the 'category' property of the test config
     * in a config.json file.
     *
     * @returns Name as String
     */
    static get name() {
        return 'radio-buttons';
    }

    /**
     * Get the static schema that is shared across all instances of this class.
     * When loading a config file to instantiate an object of this class, the config file contents
     * are validated against this schema.
     *
     * @returns Schema as String
     */
    static get schema() {
        // deep copy
        const schema = JSON.parse(JSON.stringify(AbstractTest.basicSchema));

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
        schema['properties']['category'] = {"const": "radio-buttons"};
        schema['properties']['options']['items']['properties']['correct'] = {"type": "boolean"};
        return schema;
    }

    /**
     * Get the max score that is possible for this test.
     *
     * @returns Score as Integer
     */
    get maxScore() {
        let score = 0;
        for (const opt of this.config['options']) {
            if ('correct' in opt) {
                score++;
            }
        }
        return score;
    }

    /**
     * Load test configuration from a JSON object.
     *
     * @param {String} config JSON config object
     * @returns true on success, false otherwise
     */
    loadConfig(config) {
        const ajv = new Ajv();
        const validate = ajv.compile(RadioButtonTest.schema);
        if (!validate(config)) {
            logger.warn('RadioButtonTest: ' + JSON.stringify(validate.errors));
            return false;
        }

        this.config = config;
        return true;
    }

    /**
     * Calculate the score for this test based on the given journal log.
     *
     * @param log Journal log as array containing selected single test options
     * @returns Object with three fields:
     *      1. score (Integer)
     *          Test score
     *      2. correct (Array)
     *          List of correct option indices
     *      3. wrong (Array)
     *          List of wrong option indices
     */
    calculateResult(log) {
        let result = {
            score: 0,
            correct: [],
            wrong: []
        };
        for (let i = 0; i < log.length; i++) {
            const testOptions = this.config['options'];
            const correctOption = testOptions[i]['correct'] === true ? true : false;
            if (log[i] === true && log[i] === correctOption) {
                // correct option was selected, award a point
                result.correct.push(i);
                result.score++;
            } else if (log[i] === true) {
                // option was selected, but wrong
                result.wrong.push(i);
            }
        }

        return result;
    }
}

module.exports = RadioButtonTest;
