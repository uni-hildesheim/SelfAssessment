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

        it('should throw an error for invalid configs', () => {
            expect( () => {
                new MultipleOptionTest.class({})
            }).toThrow(new Error('Invalid test config'));
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(MultipleOptionTest.class.schema['$id']).toEqual('MultipleOptionTest');
        });
    });

    describe('.maxScore (get)', () => {
        it('should return n for n correct options', () => {
            let expectedMaxScore = 0;
            for (const opt of TestData.configs['multiple-options'].options) {
                if ('correct' in opt) {
                    expectedMaxScore++;
                }
            }

            expect(this.MultipleOptionTestInstance.maxScore).toEqual(expectedMaxScore);
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
