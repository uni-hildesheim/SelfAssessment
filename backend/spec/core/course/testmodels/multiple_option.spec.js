const MultipleOptionTest = require('../../../../app/core/course/testmodels/multiple_option');
const TestData = require('./data');

describe('MultipleOptionTest', () => {
    beforeEach( () => {
        // create a new object each time to ensure tests do not affect each other
        this.MultipleOptionTestInstance = new MultipleOptionTest.class(TestData.configs['multiple-options']);
    });

    afterEach( () => {
        // dummy
    });


    describe('.constructor()', () => {
        it('should set the name', () => {
            expect(this.MultipleOptionTestInstance.name).toEqual('multiple-options');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(MultipleOptionTest.class.schema['$id']).toEqual('MultipleOptionTest');
        });
    });

    describe('.loadConfig()', () => {
        it('should return false for invalid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "multiple-options",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": 0
                    }
                ],
                "evaluated": true
            };
            const ret = this.MultipleOptionTestInstance.loadConfig(config);

            expect(ret).toBe(false);
        });

        it('should return true for valid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "multiple-options",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": 0
                    }
                ],
                "evaluated": true,
                "header": [
                    "Yes",
                    "No"
                ]
            };
            const ret = this.MultipleOptionTestInstance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
