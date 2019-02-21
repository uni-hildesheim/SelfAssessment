const Ajv = require('ajv');

// load local dependencies
const logger = require('../../../utils/logger');
const AbstractTest = require('./abstract');

class MultipleOptionTest extends AbstractTest.class {
    constructor(config) {
        super(config); // noop
        this.name = 'multiple-options';
        this.config = config;

        if (!this.loadConfig(config)) {
            throw new Error('Invalid test config');
        }
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
        schema['properties']['category'] = {"const": "multiple-options"};
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
        const validate = ajv.compile(MultipleOptionTest.schema);
        if (!validate(config)) {
            logger.warn('MultipleOptionTest: ' + JSON.stringify(validate.errors));
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
        if (this.config === null) {
            throw new Error('missing test config');
        }

        let result = {
            score: 0,
            correct: [],
            wrong: []
        };
        for (let i = 0; i < log.length; i++) {
            const testOptions = this.config['options'];
            const correctOption = testOptions[i]['correct'];
            if (log[i][correctOption] === true) {
                // correct option was selected, award a point
                result.correct.push(i);
                result.score++;
            } else {
                for (const selection of log[i]) {
                    if (selection === true) {
                        // option was selected, but wrong
                        result.wrong.push(i);
                        break;
                    }
                }
            }
        }

        return result;
    }
}

module.exports = {
    name: 'multiple-options',
    class: MultipleOptionTest,
    schema: MultipleOptionTest.schema
};
