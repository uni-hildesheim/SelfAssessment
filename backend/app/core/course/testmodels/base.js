class BaseTest {
    constructor(config) { // eslint-disable-line no-unused-vars
        if (new.target === BaseTest) {
            throw new TypeError('Cannot construct BaseTest instances');
        }
    }

    /**
     * Get the static schema that is shared across all instances of this class.
     * When loading a config file to instantiate an object of this class, the config file contents
     * are validated against this schema.
     *
     * @returns Schema as String
     */
    static get baseSchema() {
        /**
         * Schema for a generic test.
         * A generic test definition contains the following elements:
         *
         * ================
         * === REQUIRED ===
         * ================
         *
         * ----------------------------------------------------------------------------------------
         *   id           Integer: unique identifier (unique within a JSON document)
         * ----------------------------------------------------------------------------------------
         *   type         String: type of the test (i.e. logic, concentration, ...)
         *                As of now, this attribute is not taken into consideration by the backend
         *                and is relevant only to the frontend.
         * ----------------------------------------------------------------------------------------
         *   category     String: category of the test
         *                To be restricted by child tests.
         * ----------------------------------------------------------------------------------------
         *   description  String: describes the test to the user before reading the task
         *                Providides illustrations or help text preparing the user for the upcoming
         *                task.
         * ----------------------------------------------------------------------------------------
         *   task         String: task that is to be completed by the user
         * ----------------------------------------------------------------------------------------
         *   options      Array: possible options for this task
         *                A correct option will increase the test
         *                score by one, a wrong one will not affect the score.
         * ----------------------------------------------------------------------------------------
         *   evaluated    Boolean: whether the backend should evaluate this test
         *                If false, no scores will be calculated for this test.
         * ----------------------------------------------------------------------------------------
         *
         * ================
         * === OPTIONAL ===
         * ================
         *
         *----------------------------------------------------------------------------------------
         *   seconds      Integer: processing time before the test is locked down
         * ----------------------------------------------------------------------------------------
         *   **           Extended attributes for tests
         *                See child testmodels for specifications.
         * ----------------------------------------------------------------------------------------
         */
        const schema = {
            "$id": "/BaseTest",
            "type": "object",
            "properties": {
                "id": {"type": "integer"},
                "type": {"type": "string"},
                "category": {"type": "string"},
                "description": {"type": "string"},
                "task": {"type": "string"},
                "options": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "text": {"type": "string"},
                            "correct": {}
                        },
                        "required": ["text"]
                    }
                },
                "evaluated": {"type": "boolean"},
                "seconds": {"type": "integer"}
            },
            "required": ["id", "type", "category", "description", "task", "options", "evaluated"]
        };
        return schema;
    }

    /**
     * Get the max score that is possible for this test.
     *
     * @returns Score as Integer
     */
    get maxScore() {
        throw new Error('maxScore() not implemented');
    }

    /**
     * Load test configuration from a JSON object.
     *
     * @param {String} config JSON config object
     * @returns true on success, false otherwise
     */
    loadConfig(config) { // eslint-disable-line no-unused-vars
        throw new Error('loadConfig(...) not implemented');
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
    calculateResult(log) { // eslint-disable-line no-unused-vars
        throw new Error('calculateScore(...) not implemented');
    }
}

module.exports = BaseTest;
