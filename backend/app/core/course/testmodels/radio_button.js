const Ajv = require('ajv');

// load local dependencies
const logger = require('../../../utils/logger');
const AbstractTest = require('./abstract');

class RadioButtonTest extends AbstractTest.class {
    constructor(config) {
        super(config); // noop
        this.name = 'radio-buttons';
        this.config = config;

        if (!this.loadConfig(config)) {
            throw new Error('Invalid test config');
        }
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

module.exports = {
    name: 'radio-buttons',
    class: RadioButtonTest,
    schema: RadioButtonTest.schema
};
